/**
 * @fileoverview OpenAPI schema fetching and endpoint extraction
 * @module lib/schema
 * @requires fs
 * @requires path
 * @requires https
 * @requires http
 * @requires url
 */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

// ============================================================================
// Constants
// ============================================================================

const HTTP_METHODS = ['get', 'post', 'put', 'delete', 'patch'];
const METHOD_TYPES = ['Get', 'Post', 'Put', 'Delete', 'Patch'];
const TYPE_SUFFIXES = {
  parameters: 'Parameters',
  response: 'Response',
  request: 'Request',
};

// ============================================================================
// Type Definitions (JSDoc)
// ============================================================================

/**
 * @typedef {Object} PathMethodInfo
 * @property {string} summary
 * @property {string} description
 * @property {string[]} tags
 * @property {boolean} allParamsRequired
 */

/**
 * @typedef {Object} SchemaData
 * @property {Object<string, string[]>} pathMethodMap
 * @property {Object<string, Object<string, PathMethodInfo>>} pathInfoMap
 */

/**
 * @typedef {Object} TypeMatch
 * @property {string} typeName
 * @property {string} content
 */

// ============================================================================
// Pure Utility Functions - String Processing
// ============================================================================

/**
 * Pascal case를 kebab-case로 변환
 * @param {string} str - 변환할 문자열 (예: WorkspaceId)
 * @returns {string} kebab-case 문자열 (예: workspace-id)
 */
const pascalToKebab = str =>
  str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

/**
 * 타입명에서 접두사와 접미사 제거
 * @param {string} typeName - 타입명 (예: V1WorkspaceGetParameters)
 * @param {string} suffix - 제거할 접미사 (Parameters, Response, Request)
 * @returns {string} 정제된 이름 (예: workspace)
 */
const extractBaseName = (typeName, suffix) => {
  const withoutV1 = typeName.replace(/^V1/, '');
  const withoutSuffix = withoutV1.replace(new RegExp(`${suffix}$`), '');
  return pascalToKebab(withoutSuffix);
};

/**
 * 주석에서 제거
 * @param {string} content - 원본 문자열
 * @returns {string} 주석이 제거된 문자열
 */
const removeComments = content => content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '');

/**
 * 파일명 정제 (v1- 접두사와 .ts 확장자 제거)
 * @param {string} fileName - 파일명
 * @returns {string} 정제된 파일명
 */
const cleanFileName = fileName => fileName.replace('.ts', '').replace(/^v1-/, '');

// ============================================================================
// Pure Utility Functions - Schema Processing
// ============================================================================

/**
 * HTTP 메서드만 필터링
 * @param {string[]} keys - 객체 키 배열
 * @returns {string[]} HTTP 메서드 배열
 */
const filterHttpMethods = keys => keys.filter(key => HTTP_METHODS.includes(key.toLowerCase()));

/**
 * 경로의 모든 메서드 카운트 계산
 * @param {Object<string, string[]>} pathMethodMap - 경로-메서드 맵
 * @returns {number} 총 메서드 수
 */
const countTotalMethods = pathMethodMap =>
  Object.values(pathMethodMap).reduce((total, methods) => total + methods.length, 0);

/**
 * 파라미터가 모두 required인지 확인
 * @param {Array} parameters - 파라미터 배열
 * @returns {boolean} 모두 required이면 true
 */
const areAllParamsRequired = parameters => {
  if (!parameters || parameters.length === 0) return false;
  return parameters.every(param => param.required === true);
};

/**
 * 메서드 정보 생성
 * @param {Object} methodInfo - OpenAPI 메서드 정보
 * @returns {PathMethodInfo} 정제된 메서드 정보
 */
const createMethodInfo = methodInfo => ({
  summary: methodInfo.summary || '',
  description: methodInfo.description || '',
  tags: methodInfo.tags || [],
  allParamsRequired: areAllParamsRequired(methodInfo.parameters || []),
});

/**
 * 경로별 메서드 정보 맵 생성
 * @param {Object} pathItem - OpenAPI 경로 아이템
 * @param {string[]} methods - 메서드 배열
 * @returns {Object<string, PathMethodInfo>} 메서드별 정보 맵
 */
const createPathInfoForMethods = (pathItem, methods) =>
  methods.reduce((acc, method) => {
    acc[method.toUpperCase()] = createMethodInfo(pathItem[method]);
    return acc;
  }, {});

/**
 * OpenAPI paths에서 경로-메서드 맵과 정보 맵 추출
 * @param {Object} paths - OpenAPI paths 객체
 * @returns {SchemaData} 경로-메서드 맵과 정보 맵
 */
const extractPathsData = paths => {
  const pathMethodMap = {};
  const pathInfoMap = {};

  Object.entries(paths).forEach(([path, pathItem]) => {
    const methods = filterHttpMethods(Object.keys(pathItem));

    if (methods.length > 0) {
      pathMethodMap[path] = methods.map(m => m.toUpperCase());
      pathInfoMap[path] = createPathInfoForMethods(pathItem, methods);
    }
  });

  return { pathMethodMap, pathInfoMap };
};

// ============================================================================
// HTTP Request Functions (Side Effects)
// ============================================================================

/**
 * HTTP/HTTPS 요청 옵션 생성
 * @param {URL} parsedUrl - 파싱된 URL 객체
 * @returns {Object} HTTP 요청 옵션
 */
const createRequestOptions = parsedUrl => ({
  hostname: parsedUrl.hostname,
  port: parsedUrl.port,
  path: parsedUrl.pathname + parsedUrl.search,
  method: 'GET',
  rejectUnauthorized: false,
});

/**
 * HTTP 요청 수행
 * @param {Object} client - http 또는 https 클라이언트
 * @param {Object} options - 요청 옵션
 * @returns {Promise<string>} 응답 데이터
 */
const performHttpRequest = (client, options) =>
  new Promise((resolve, reject) => {
    const req = client.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => resolve(data));
    });

    req.on('error', error => reject(error));
    req.end();
  });

/**
 * Fetch and parse OpenAPI schema from URL
 *
 * Downloads OpenAPI/Swagger schema and extracts path-method mappings
 * and detailed method information (summary, description, tags)
 *
 * @param {string} url - OpenAPI documentation URL (http or https)
 * @returns {Promise<SchemaData>} Promise resolving to schema data
 *
 * @example
 * const schema = await fetchOpenApiSchema('https://api.example.com/openapi.json');
 * // Returns: { pathMethodMap: { '/users': ['GET', 'POST'] }, pathInfoMap: {...} }
 */
export async function fetchOpenApiSchema(url) {
  console.log('🔍 OpenAPI 스키마 로드 중...');

  try {
    const https = await import('https');
    const http = await import('http');
    const { URL } = await import('url');

    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const options = createRequestOptions(parsedUrl);

    const data = await performHttpRequest(client, options);
    const schema = JSON.parse(data);

    if (!schema.paths) {
      console.warn('⚠️  OpenAPI 스키마에 paths가 없습니다.');
      return { pathMethodMap: {}, pathInfoMap: {} };
    }

    const result = extractPathsData(schema.paths);
    const totalMethods = countTotalMethods(result.pathMethodMap);

    console.log(
      `✅ ${Object.keys(result.pathMethodMap).length}개의 경로에서 ${totalMethods}개의 메소드 정보 추출 완료`,
    );
    return result;
  } catch (error) {
    console.warn('⚠️  OpenAPI 스키마 로드 실패:', error.message);
    return { pathMethodMap: {}, pathInfoMap: {} };
  }
}

// ============================================================================
// Type File Processing - Pure Functions
// ============================================================================

/**
 * 타입 파일 필터링 조건
 * @param {string} file - 파일명
 * @returns {boolean} 처리 대상 파일이면 true
 */
const isValidTypeFile = file =>
  file.endsWith('.ts') && file !== 'index.ts' && !file.includes('schemas') && !file.includes('enum');

/**
 * 디렉토리에서 타입 파일 목록과 내용 읽기
 * @param {string} typesDir - 타입 디렉토리 경로
 * @returns {Map<string, string>} 파일명-내용 맵
 */
const readTypeFiles = typesDir => {
  const files = readdirSync(typesDir).filter(isValidTypeFile);
  const fileContents = new Map();

  files.forEach(file => {
    const filePath = join(typesDir, file);
    const content = readFileSync(filePath, 'utf-8');
    fileContents.set(file, content);
  });

  return fileContents;
};

/**
 * 타입 매칭을 위한 정규식 생성
 * @param {string} methodType - 메서드 타입 (Get, Post 등)
 * @param {string} typeKind - 타입 종류 (Parameters, Response, Request)
 * @returns {RegExp} 정규식
 */
const createTypeRegex = (methodType, typeKind) => {
  if (typeKind === TYPE_SUFFIXES.parameters) {
    return new RegExp(`export interface (\\w+${methodType}${typeKind})`);
  }
  return new RegExp(`export (type|interface) (\\w+${methodType}${typeKind})`);
};

/**
 * 타입 매칭
 * @param {string} content - 파일 내용
 * @param {string} methodType - 메서드 타입
 * @param {string} typeKind - 타입 종류
 * @returns {string|null} 타입명 또는 null
 */
const matchType = (content, methodType, typeKind) => {
  const regex = createTypeRegex(methodType, typeKind);
  const match = content.match(regex);
  return match ? match[match.length - 1] : null;
};

/**
 * 경로 주석에서 실제 경로 추출
 * @param {string} content - 파일 내용
 * @param {string} methodType - 메서드 타입 (Get, Post 등)
 * @returns {string|null} 추출된 경로 또는 null
 */
const extractPathFromComment = (content, methodType) => {
  const pathCommentRegex = new RegExp(
    `\\*\\s+(?:Parameter|Request body|Response body) of \\(${methodType.toLowerCase()}\\)\\s+(\\/.+)`,
  );
  const match = content.match(pathCommentRegex);
  return match ? match[1].trim().split(/\s/)[0] : null;
};

/**
 * API 설명 추출
 * @param {string} content - 파일 내용
 * @param {string} method - HTTP 메서드 (소문자)
 * @returns {string} API 설명
 */
const extractApiDescription = (content, method) => {
  const descriptionRegex = new RegExp(`\\(${method}\\)[^-]+-\\s+(.+)`);
  const match = content.match(descriptionRegex);
  return match ? match[1].trim() : '';
};

/**
 * Request body 경로 추출 (fallback)
 * @param {string} content - 파일 내용
 * @param {string} method - HTTP 메서드 (소문자)
 * @returns {string|null} 추출된 경로 또는 null
 */
const extractBodyPath = (content, method) => {
  const bodyPathPattern = new RegExp(`(?:Request body|Response body) of \\(${method}\\) (\\/v1\\/[^\\s\\n]*)`, 'i');
  const match = content.match(bodyPathPattern);
  return match ? match[1] : null;
};

/**
 * 인터페이스 내용 추출
 * @param {string} content - 파일 내용
 * @param {string} typeName - 타입명
 * @returns {string|null} 인터페이스 내용 또는 null
 */
const extractInterfaceContent = (content, typeName) => {
  const interfaceStart = content.indexOf(`export interface ${typeName}`);
  if (interfaceStart === -1) return null;

  const nextBrace = content.indexOf('{', interfaceStart);
  const interfaceEnd = content.indexOf('}', nextBrace);

  if (interfaceEnd === -1 || nextBrace === -1) return null;

  return content.substring(nextBrace + 1, interfaceEnd);
};

/**
 * 인터페이스에 optional 속성이 있는지 확인
 * @param {string} content - 파일 내용
 * @param {string} paramType - 파라미터 타입명
 * @returns {boolean} optional 속성이 있으면 true
 */
const hasOptionalProperties = (content, paramType) => {
  const interfaceContent = extractInterfaceContent(content, paramType);
  if (!interfaceContent) return false;

  const contentWithoutComments = removeComments(interfaceContent);
  return /\w+\s*\?/.test(contentWithoutComments);
};

/**
 * 경로에서 파라미터명 추출
 * @param {string} path - API 경로 (예: /v1/workspace/{workspaceId})
 * @returns {string[]} 파라미터명 배열 (예: ['workspaceId'])
 */
const extractPathParamNames = path => {
  const matches = Array.from(path.matchAll(/\{(\w+)\}/g));
  return matches.map(match => match[1]);
};

/**
 * 인터페이스에서 경로 파라미터 확인
 * @param {string} interfaceContent - 인터페이스 내용
 * @param {string[]} paramNames - 파라미터명 배열
 * @returns {string[]} 존재하는 경로 파라미터 배열
 */
const findPathParams = (interfaceContent, paramNames) =>
  paramNames.filter(paramName => {
    const paramRegex = new RegExp(`\\b${paramName}\\s*[:?]`);
    return paramRegex.test(interfaceContent);
  });

/**
 * 인터페이스에서 모든 속성명 추출
 * @param {string} interfaceContent - 인터페이스 내용
 * @returns {string[]} 속성명 배열
 */
const extractPropertyNames = interfaceContent => {
  const contentWithoutComments = removeComments(interfaceContent);
  const matches = Array.from(contentWithoutComments.matchAll(/(\w+)\s*[:?]/g));
  return matches.map(match => match[1]).filter(name => /^[a-zA-Z_$]/.test(name));
};

/**
 * 쿼리 파라미터 추출 (경로 파라미터만 제외, page는 쿼리 파라미터로 포함)
 * @param {string[]} allParams - 모든 파라미터
 * @param {string[]} pathParams - 경로 파라미터
 * @returns {string[]} 쿼리 파라미터 배열
 */
const extractQueryParams = (allParams, pathParams) => allParams.filter(param => !pathParams.includes(param));

/**
 * 파라미터 정보 추출 (page, 경로, 쿼리 파라미터)
 * @param {string} content - 파일 내용
 * @param {string} paramType - 파라미터 타입명
 * @param {string|null} actualPath - 실제 API 경로
 * @returns {Object} 파라미터 정보 { hasPageParam, pathParams, queryParams }
 */
const extractParamInfo = (content, paramType, actualPath) => {
  const interfaceContent = extractInterfaceContent(content, paramType);
  if (!interfaceContent) {
    return { hasPageParam: false, pathParams: [], queryParams: [] };
  }

  const hasPageParam = /\bpage\s*[:?]/.test(interfaceContent);
  const pathParamNames = actualPath ? extractPathParamNames(actualPath) : [];
  const pathParams = findPathParams(interfaceContent, pathParamNames);
  const allParams = extractPropertyNames(interfaceContent);
  const queryParams = extractQueryParams(allParams, pathParams);

  return { hasPageParam, pathParams, queryParams };
};

/**
 * 타입 정보로부터 baseName 추출
 * @param {string} fileName - 파일명
 * @param {string|null} paramTypeName - 파라미터 타입명
 * @param {string|null} responseTypeName - 응답 타입명
 * @returns {string} baseName
 */
const deriveBaseName = (fileName, paramTypeName, responseTypeName) => {
  let baseName = cleanFileName(fileName);

  if (paramTypeName) {
    const suffixes = Object.values(TYPE_SUFFIXES)
      .map(s => s + '$')
      .join('|');
    const extracted = extractBaseName(paramTypeName, `(${suffixes})`);
    if (extracted) baseName = extracted;
  } else if (responseTypeName) {
    const suffixes = Object.values(TYPE_SUFFIXES)
      .map(s => s + '$')
      .join('|');
    const extracted = extractBaseName(responseTypeName, `(${suffixes})`);
    if (extracted) baseName = extracted;
  }

  return baseName;
};

/**
 * OpenAPI 정보와 타입 정보 결합하여 API 설명 생성
 * @param {string} path - API 경로
 * @param {string} method - HTTP 메서드
 * @param {Object} pathInfoMap - 경로 정보 맵
 * @param {string} content - 파일 내용
 * @returns {string} API 설명
 */
const buildApiDescription = (path, method, pathInfoMap, content) => {
  // OpenAPI 스키마에서 추출
  if (pathInfoMap[path]?.[method]) {
    const methodInfo = pathInfoMap[path][method];
    const description = methodInfo.summary || methodInfo.description || '';
    const tags = methodInfo.tags?.length > 0 ? methodInfo.tags.join(', ') + '-' : '';
    return tags + description;
  }

  // 타입 파일 주석에서 추출
  return extractApiDescription(content, method.toLowerCase());
};

// ============================================================================
// Endpoint Creation
// ============================================================================

/**
 * 엔드포인트 객체 생성
 * @param {Object} params - 엔드포인트 파라미터
 * @returns {Object} 엔드포인트 객체
 */
const createEndpoint = ({
  actualPath,
  allParamsRequired,
  apiDescription,
  baseName,
  file,
  hasPageParam,
  method,
  paramType,
  pathParams,
  queryParams,
  requestType,
  responseType,
}) => ({
  file,
  baseName,
  method,
  paramType,
  responseType,
  requestType,
  hasPageParam,
  pathParams,
  queryParams,
  actualPath,
  apiDescription,
  allParamsRequired,
});

/**
 * 단일 파일에서 엔드포인트 추출 (Fallback 모드)
 * @param {string} file - 파일명
 * @param {string} content - 파일 내용
 * @param {string} methodType - 메서드 타입 (Get, Post 등)
 * @param {string} method - HTTP 메서드 (GET, POST 등)
 * @returns {Object|null} 엔드포인트 객체 또는 null
 */
const extractEndpointFromFile = (file, content, methodType, method) => {
  // 타입 매칭
  const paramType = matchType(content, methodType, TYPE_SUFFIXES.parameters);
  const responseType = matchType(content, methodType, TYPE_SUFFIXES.response) || (method === 'DELETE' ? 'void' : null);
  const requestType = matchType(content, methodType, TYPE_SUFFIXES.request);

  // DELETE는 Parameters만 있어도 처리
  if (!paramType && method !== 'DELETE') return null;
  if (!paramType && !responseType && !requestType && method === 'DELETE') return null;

  // 경로 추출
  let actualPath = extractPathFromComment(content, methodType);

  // Request/Response body 주석에서 경로 추출 (fallback)
  if (!actualPath && (requestType || responseType)) {
    actualPath = extractBodyPath(content, method.toLowerCase());
  }

  // 파라미터 정보 추출
  const { hasPageParam, pathParams, queryParams } = paramType
    ? extractParamInfo(content, paramType, actualPath)
    : { hasPageParam: false, pathParams: [], queryParams: [] };

  // baseName 추출
  const baseName = deriveBaseName(file, paramType, responseType);

  // API 설명 추출
  const apiDescription = extractApiDescription(content, method.toLowerCase());

  return createEndpoint({
    file,
    baseName,
    method,
    paramType,
    responseType,
    requestType,
    hasPageParam,
    pathParams,
    queryParams,
    actualPath,
    apiDescription,
    allParamsRequired: false, // fallback 모드에서는 안전하게 false
  });
};

/**
 * Extract endpoint information from generated type files (fallback mode)
 *
 * Used when OpenAPI schema is not available or fails to load
 * Parses TypeScript type files to extract endpoint information
 *
 * @private
 * @param {string} typesDir - Absolute path to types directory
 * @returns {import('../../types').Endpoint[]} Array of endpoint information
 */
function extractEndpointsFallback(typesDir) {
  const fileContents = readTypeFiles(typesDir);
  const endpoints = [];

  for (const [file, content] of fileContents.entries()) {
    for (let i = 0; i < METHOD_TYPES.length; i++) {
      const methodType = METHOD_TYPES[i];
      const method = HTTP_METHODS[i].toUpperCase();

      const endpoint = extractEndpointFromFile(file, content, methodType, method);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    }
  }

  console.log(`✅ ${endpoints.length}개의 엔드포인트 발견 (fallback 모드)`);
  return endpoints;
}

/**
 * 경로와 메서드에 해당하는 타입 파일 찾기
 * @param {Map<string, string>} fileContents - 파일-내용 맵
 * @param {string} path - API 경로
 * @param {string} method - HTTP 메서드 (소문자)
 * @returns {[string, string]|null} [파일명, 내용] 튜플 또는 null
 */
const findTypeFileForPath = (fileContents, path, method) => {
  const escapedPath = path.replace(/[{}]/g, '\\$&');
  const pathCommentRegex = new RegExp(
    `\\*\\s+(?:Parameter|Request body|Response body) of \\(${method}\\)\\s+${escapedPath}(?:\\s|$)`,
  );

  for (const [file, content] of fileContents.entries()) {
    if (pathCommentRegex.test(content)) {
      return [file, content];
    }
  }

  return null;
};

/**
 * OpenAPI 경로-메서드에서 엔드포인트 생성
 * @param {string} path - API 경로
 * @param {string} method - HTTP 메서드 (대문자)
 * @param {Map<string, string>} fileContents - 파일-내용 맵
 * @param {Object} pathInfoMap - 경로 정보 맵
 * @returns {Object|null} 엔드포인트 객체 또는 null
 */
const createEndpointFromSchema = (path, method, fileContents, pathInfoMap) => {
  const methodType = method.charAt(0) + method.slice(1).toLowerCase();

  // 타입 파일 찾기
  const fileInfo = findTypeFileForPath(fileContents, path, method.toLowerCase());
  if (!fileInfo) {
    console.warn(`⚠️  ${method} ${path}에 대한 타입 파일을 찾을 수 없습니다.`);
    return null;
  }

  const [file, content] = fileInfo;

  // 타입 매칭
  const paramType = matchType(content, methodType, TYPE_SUFFIXES.parameters);
  const responseType = matchType(content, methodType, TYPE_SUFFIXES.response) || (method === 'DELETE' ? 'void' : null);
  const requestType = matchType(content, methodType, TYPE_SUFFIXES.request);

  // Response 타입이 없으면 건너뛰기 (DELETE는 예외)
  if (!responseType && method !== 'DELETE') {
    console.warn(`⚠️  ${method} ${path}에 대한 Response 타입을 찾을 수 없습니다.`);
    return null;
  }

  // 파라미터 정보 추출
  const { hasPageParam, pathParams, queryParams } = paramType
    ? extractParamInfo(content, paramType, path)
    : { hasPageParam: false, pathParams: [], queryParams: [] };

  // baseName 추출
  const baseName = deriveBaseName(file, paramType, responseType);

  // API 설명 생성
  const apiDescription = buildApiDescription(path, method, pathInfoMap, content);

  // allParamsRequired 결정
  const allParamsRequired = paramType ? hasOptionalProperties(content, paramType) : false;

  return createEndpoint({
    file,
    baseName,
    method,
    paramType,
    responseType,
    requestType,
    hasPageParam,
    pathParams,
    queryParams,
    actualPath: path,
    apiDescription,
    allParamsRequired,
  });
};

/**
 * Extract endpoint information from generated type files using OpenAPI schema
 *
 * Combines OpenAPI schema information with generated TypeScript types
 * to create complete endpoint metadata for code generation
 *
 * Falls back to type-file-only extraction if OpenAPI schema is unavailable
 *
 * @param {string} typesDir - Absolute path to types directory
 * @param {SchemaData} schemaData - OpenAPI schema data from fetchOpenApiSchema
 * @returns {import('../../types').Endpoint[]} Array of endpoint information
 *
 * @example
 * const schema = await fetchOpenApiSchema('https://api.example.com/openapi.json');
 * const endpoints = extractEndpoints('/path/to/types', schema);
 * // Returns array of endpoint objects with method, types, params, etc.
 */
export function extractEndpoints(typesDir, schemaData) {
  console.log('🔍 엔드포인트 정보 추출 중...');

  const { pathInfoMap = {}, pathMethodMap = {} } = schemaData || {};

  // OpenAPI 스키마가 비어있으면 fallback
  if (Object.keys(pathMethodMap).length === 0) {
    console.warn('⚠️  OpenAPI 스키마 정보가 없어 타입 파일 기반으로 추출합니다.');
    return extractEndpointsFallback(typesDir);
  }

  // 타입 파일 읽기
  const fileContents = readTypeFiles(typesDir);

  // OpenAPI 스키마 기반으로 엔드포인트 생성
  const endpoints = [];

  for (const [path, methods] of Object.entries(pathMethodMap)) {
    for (const method of methods) {
      const endpoint = createEndpointFromSchema(path, method, fileContents, pathInfoMap);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    }
  }

  console.log(`✅ ${endpoints.length}개의 엔드포인트 발견`);
  return endpoints;
}
