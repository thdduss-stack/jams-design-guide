/**
 * @fileoverview File generation functions for workspace fetch generator
 * @module lib/generators
 */

/* eslint-disable no-console */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import { basename, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';
import { getProjectRoot } from './config.mjs';
import { extractEndpoints, fetchOpenApiSchema } from './schema.mjs';
import { extractKeywordFromDescription, toPascalCase } from './utils.mjs';

// ============================================================================
// Constants
// ============================================================================

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// ============================================================================
// Type Definitions (JSDoc)
// ============================================================================

/**
 * @typedef {Object} EndpointConfig
 * @property {string} actualPath
 * @property {string} apiDescription
 * @property {string} baseName
 * @property {boolean} hasPageParam
 * @property {string} method
 * @property {string} paramType
 * @property {string[]} pathParams
 * @property {string[]} queryParams
 * @property {string} requestType
 * @property {string} responseType
 * @property {boolean} allParamsRequired
 */

/**
 * @typedef {Object} FunctionMetadata
 * @property {string} functionName
 * @property {string} pathTemplate
 * @property {boolean} hasPathParams
 * @property {boolean} hasQueryParams
 * @property {string[]} validQueryParams
 * @property {string} apiComment
 */

// ============================================================================
// Pure Utility Functions
// ============================================================================

/**
 * 경로 파라미터를 kebab-case로 변환
 * @param {string} paramName - 파라미터 이름 (예: workspaceId)
 * @returns {string} kebab-case로 변환된 이름 (예: workspace-id)
 */
const toKebabCase = paramName =>
  paramName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');

/**
 * 경로에서 {param} 형태를 kebab-case로 변환
 * @param {string} path - API 경로
 * @returns {string} 변환된 경로
 */
const cleanPathParams = path =>
  path.replace(/\{([^}]+)\}/g, (_, paramName) => toKebabCase(paramName)).replace(/\/+/g, '/');

/**
 * 경로에서 버전 접두사 제거
 * @param {string} path - API 경로
 * @returns {string} 버전 접두사가 제거된 경로
 */
const removeVersionPrefix = path => path.replace(/^\/v\d+\//, '');

/**
 * 경로를 함수명 기본값으로 변환
 * @param {string} actualPath - 실제 API 경로
 * @returns {string} 함수명으로 사용할 기본 이름
 */
const pathToFunctionBaseName = actualPath => {
  if (!actualPath) return '';

  const pathWithoutV1 = removeVersionPrefix(actualPath);
  const cleanPath = cleanPathParams(pathWithoutV1);

  return cleanPath.replace(/\//g, '-').replace(/-+$/, '').replace(/-+/g, '-');
};

/**
 * V1 접두사가 있는지 확인
 * @param {string} [paramType] - 파라미터 타입
 * @param {string} [responseType] - 응답 타입
 * @returns {boolean} V1 접두사 존재 여부
 */
const hasV1Prefix = (paramType, responseType) => paramType?.startsWith('V1') || responseType?.startsWith('V1') || false;

/**
 * 메서드와 함수명을 조합하여 전체 함수명 생성
 * @param {string} method - HTTP 메서드
 * @param {string} baseName - 기본 함수명
 * @param {boolean} hasV1 - V1 접두사 여부
 * @returns {string} 완전한 함수명
 */
const buildFunctionName = (method, baseName, hasV1) => {
  const methodPrefix = method.toLowerCase();
  const pascalBaseName = toPascalCase(baseName);
  return hasV1 ? `${methodPrefix}V1${pascalBaseName}` : `${methodPrefix}${pascalBaseName}`;
};

/**
 * 유효한 JavaScript 식별자 필터링
 * @param {string[]} params - 파라미터 배열
 * @returns {string[]} 유효한 식별자만 포함된 배열
 */
const filterValidIdentifiers = params => params.filter(p => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(p));

/**
 * 경로 템플릿을 생성 (파라미터 interpolation 포함)
 * @param {string} actualPath - 실제 경로
 * @param {string[]} pathParams - 경로 파라미터 목록
 * @param {string} baseName - 기본 이름
 * @param {boolean} hasV1 - V1 접두사 여부
 * @returns {string} 경로 템플릿
 */
const buildPathTemplate = (actualPath, pathParams, baseName, hasV1) => {
  if (actualPath && pathParams.length > 0) {
    return actualPath.replace(/\{(\w+)\}/g, '${params.$1}');
  }
  if (actualPath) {
    return actualPath;
  }
  return hasV1 ? `/v1/${baseName}` : `/${baseName}`;
};

/**
 * API 주석 생성
 * @param {string} apiDescription - API 설명
 * @param {string} baseName - 기본 이름
 * @param {string} method - HTTP 메서드
 * @param {string} pathTemplate - 경로 템플릿
 * @param {string} defaultAction - 기본 동작 (조회/생성/수정/삭제)
 * @returns {string} API 주석
 */
const buildApiComment = (apiDescription, baseName, method, pathTemplate, defaultAction) => {
  const cleanPath = pathTemplate.replace(/\$\{params\.(\w+)\}/g, '{$1}');
  const description = apiDescription || `${baseName} ${defaultAction}`;
  return `// ${description} - ${method} ${cleanPath}`;
};

/**
 * 파라미터 타입 결정 (타입 정의를 그대로 사용)
 * @param {boolean} hasPageParam - page 파라미터 존재 여부 (사용하지 않음, 하위 호환성 유지)
 * @param {string} [paramType] - 기본 파라미터 타입
 * @returns {string} 최종 파라미터 타입
 */
const resolveParamsType = (hasPageParam, paramType = 'Record<string, unknown>') => paramType;

// ============================================================================
// Function Name Generation
// ============================================================================

/**
 * 고유한 함수명 생성 (중복 처리 포함)
 * @param {string} baseFunctionName - 기본 함수명
 * @param {Map<string, string>} functionNames - 기존 함수명 맵
 * @param {string} key - 고유 키 (method-path)
 * @param {string} apiDescription - API 설명 (키워드 추출용)
 * @returns {string} 고유한 함수명
 */
const generateUniqueFunctionName = (baseFunctionName, functionNames, key, apiDescription) => {
  const isProcessed = Array.from(functionNames.values()).includes(key);
  if (isProcessed) return null;

  if (!functionNames.has(baseFunctionName)) {
    return baseFunctionName;
  }

  // 중복된 경우 키워드 추출
  const keyword = extractKeywordFromDescription(apiDescription);
  if (keyword) {
    const nameWithKeyword = `${baseFunctionName}${keyword}`;
    if (!functionNames.has(nameWithKeyword)) {
      return nameWithKeyword;
    }
  }

  // 카운터로 해결
  let counter = 2;
  const baseName = keyword ? `${baseFunctionName}${keyword}` : baseFunctionName;
  let uniqueName = `${baseName}${counter}`;
  while (functionNames.has(uniqueName)) {
    counter++;
    uniqueName = `${baseName}${counter}`;
  }
  return uniqueName;
};

// ============================================================================
// Code Generation - Common Patterns
// ============================================================================

/**
 * 쿼리 파라미터 객체 코드 생성
 * @param {string[]} validQueryParams - 유효한 쿼리 파라미터 목록
 * @returns {string} 쿼리 객체 코드
 */
const buildQueryCode = validQueryParams => validQueryParams.map(p => `${p}: params.${p}`).join(', ');

/**
 * GET 요청 함수 코드 생성
 * @param {FunctionMetadata} meta - 함수 메타데이터
 * @param {string} paramsType - 파라미터 타입
 * @param {string} responseType - 응답 타입
 * @returns {string} 생성된 함수 코드
 */
const generateGetFunctionCode = (meta, paramsType, responseType) => {
  const { apiComment, functionName, hasPathParams, hasQueryParams, pathTemplate, validQueryParams } = meta;
  const response = responseType || 'unknown';

  if (hasPathParams && hasQueryParams) {
    const queryCode = buildQueryCode(validQueryParams);
    return `${apiComment}
export const ${functionName} = async (
  params: ${paramsType},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.get<${response}>(
    \`${pathTemplate}\`,
    {
      query: { ${queryCode} },
    },
    headers,
  );
  return response.data;
};`;
  }

  if (hasPathParams && !hasQueryParams) {
    return `${apiComment}
export const ${functionName} = async (
  params: ${paramsType},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.get<${response}>(
    \`${pathTemplate}\`,
    {},
    headers,
  );
  return response.data;
};`;
  }

  if (!hasPathParams && hasQueryParams) {
    return `${apiComment}
export const ${functionName} = async (
  params?: ${paramsType},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.get<${response}>(
    \`${pathTemplate}\`,
    {
      query: { ...params },
    },
    headers,
  );
  return response.data;
};`;
  }

  // 경로 파라미터도 없고 쿼리 파라미터도 없는 경우 - params 없이 생성
  return `${apiComment}
export const ${functionName} = async (headers?: () => Headers) => {
  const response = await workspaceFetchClient.get<${response}>(
    \`${pathTemplate}\`,
    {},
    headers,
  );
  return response.data;
};`;
};

/**
 * Mutation 요청 함수 코드 생성 (POST/PUT/PATCH)
 * @param {string} httpMethod - HTTP 메서드 (post/put/patch)
 * @param {FunctionMetadata} meta - 함수 메타데이터
 * @param {Object} options - 추가 옵션
 * @param {string} [options.paramType] - 파라미터 타입
 * @param {string} [options.requestType] - 요청 본문 타입
 * @param {string} [options.responseType] - 응답 타입
 * @param {boolean} options.hasPathParams - 경로 파라미터 존재 여부
 * @param {boolean} options.hasQueryParams - 쿼리 파라미터 존재 여부
 * @returns {string} 생성된 함수 코드
 */
const generateMutationFunctionCode = (httpMethod, meta, options) => {
  const { apiComment, functionName, pathTemplate, validQueryParams } = meta;
  const { hasPathParams, hasQueryParams, paramType, requestType, responseType } = options;

  const method = httpMethod.toLowerCase();
  const response = responseType || 'unknown';
  const needsParams = hasPathParams || hasQueryParams || paramType;

  if (!requestType) {
    // request body가 없는 경우
    const queryBlock = hasQueryParams
      ? `{
      ...(params && { query: { ${buildQueryCode(validQueryParams)} } }),
    }`
      : '{}';

    return `${apiComment}
export const ${functionName} = async (
  params${hasPathParams ? '' : '?'}: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.${method}<${response}>(
    \`${pathTemplate}\`,
    ${queryBlock},
    headers,
  );
  return response.data;
};`;
  }

  // request body가 있는 경우
  if (needsParams && hasQueryParams) {
    const queryCode = buildQueryCode(validQueryParams);
    return `${apiComment}
export const ${functionName} = async (
  data: ${requestType},
  params${hasPathParams ? '' : '?'}: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.${method}<${response}>(
    \`${pathTemplate}\`,
    {
      data: { ...data },
      ...(params && { query: { ${queryCode} } }),
    },
    headers,
  );
  return response.data;
};`;
  }

  if (needsParams && !hasQueryParams) {
    return `${apiComment}
export const ${functionName} = async (
  data: ${requestType},
  params${hasPathParams ? '' : '?'}: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.${method}<${response}>(
    \`${pathTemplate}\`,
    {
      data: { ...data },
    },
    headers,
  );
  return response.data;
};`;
  }

  return `${apiComment}
export const ${functionName} = async (
  data: ${requestType},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.${method}<${response}>(
    \`${pathTemplate}\`,
    {
      data: { ...data },
    },
    headers,
  );
  return response.data;
};`;
};

/**
 * DELETE 요청 함수 코드 생성
 * @param {FunctionMetadata} meta - 함수 메타데이터
 * @param {string} [paramType] - 파라미터 타입
 * @param {string} [responseType] - 응답 타입
 * @param {boolean} hasPathParams - 경로 파라미터 존재 여부
 * @param {boolean} hasQueryParams - 쿼리 파라미터 존재 여부
 * @returns {string} 생성된 함수 코드
 */
const generateDeleteFunctionCode = (meta, paramType, responseType, hasPathParams, hasQueryParams) => {
  const { apiComment, functionName, pathTemplate, validQueryParams } = meta;
  const response = responseType || 'void';

  if (hasPathParams && hasQueryParams) {
    const queryCode = buildQueryCode(validQueryParams);
    return `${apiComment}
export const ${functionName} = async (
  params: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.delete<${response}>(
    \`${pathTemplate}\`,
    {
      query: { ${queryCode} },
    },
    headers,
  );
  return response.data;
};`;
  }

  if (hasPathParams && !hasQueryParams) {
    return `${apiComment}
export const ${functionName} = async (
  params: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.delete<${response}>(
    \`${pathTemplate}\`,
    {},
    headers,
  );
  return response.data;
};`;
  }

  if (!hasPathParams && hasQueryParams) {
    return `${apiComment}
export const ${functionName} = async (
  params?: ${paramType || 'Record<string, unknown>'},
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.delete<${response}>(
    \`${pathTemplate}\`,
    {
      query: { ...params },
    },
    headers,
  );
  return response.data;
};`;
  }

  return `${apiComment}
export const ${functionName} = async (
  params?: Record<string, unknown>,
  headers?: () => Headers,
) => {
  const response = await workspaceFetchClient.delete<${response}>(
    \`${pathTemplate}\`,
    {},
    headers,
  );
  return response.data;
};`;
};

/**
 * 엔드포인트에서 함수 메타데이터 추출
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {string} functionName - 함수명
 * @param {string} defaultAction - 기본 동작명
 * @returns {FunctionMetadata} 함수 메타데이터
 */
const extractFunctionMetadata = (endpoint, functionName, defaultAction) => {
  const { actualPath, apiDescription, baseName, method, paramType, pathParams, queryParams, responseType } = endpoint;

  const hasV1 = hasV1Prefix(paramType, responseType);
  const pathTemplate = buildPathTemplate(actualPath, pathParams, baseName, hasV1);
  const hasPathParams = pathParams.length > 0;
  const validQueryParams = filterValidIdentifiers(queryParams);
  const hasQueryParams = validQueryParams.length > 0;
  const apiComment = buildApiComment(apiDescription, baseName, method, pathTemplate, defaultAction);

  return {
    functionName,
    pathTemplate,
    hasPathParams,
    hasQueryParams,
    validQueryParams,
    apiComment,
  };
};

/**
 * HTTP 메서드에 따른 함수 코드 생성
 * @param {string} method - HTTP 메서드
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {string} functionName - 함수명
 * @returns {string} 생성된 함수 코드
 */
const generateFunctionCodeByMethod = (method, endpoint, functionName) => {
  const actionMap = {
    [HTTP_METHODS.GET]: '조회',
    [HTTP_METHODS.POST]: '생성',
    [HTTP_METHODS.PUT]: '수정',
    [HTTP_METHODS.PATCH]: '수정',
    [HTTP_METHODS.DELETE]: '삭제',
  };

  const meta = extractFunctionMetadata(endpoint, functionName, actionMap[method]);
  const { hasPathParams, hasQueryParams } = meta;
  const { hasPageParam, paramType, requestType, responseType } = endpoint;

  switch (method) {
    case HTTP_METHODS.GET: {
      const paramsType =
        hasPathParams || hasQueryParams
          ? resolveParamsType(hasPageParam, paramType)
          : paramType || 'Record<string, unknown>';
      return generateGetFunctionCode(meta, paramsType, responseType);
    }

    case HTTP_METHODS.POST:
    case HTTP_METHODS.PUT:
    case HTTP_METHODS.PATCH: {
      const methodName = method.toLowerCase();
      return generateMutationFunctionCode(methodName, meta, {
        paramType,
        requestType,
        responseType,
        hasPathParams,
        hasQueryParams,
      });
    }

    case HTTP_METHODS.DELETE:
      return generateDeleteFunctionCode(meta, paramType, responseType, hasPathParams, hasQueryParams);

    default:
      return '';
  }
};

// ============================================================================
// Endpoint Processing
// ============================================================================

/**
 * 엔드포인트를 처리하여 함수 코드 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {Set<string>} imports - import 타입 Set
 * @param {Map<string, string>} functionNames - 함수명 맵
 * @returns {string|null} 생성된 함수 코드 또는 null
 */
const processEndpoint = (endpoint, imports, functionNames) => {
  const { actualPath, apiDescription, baseName, method, paramType, requestType, responseType } = endpoint;

  // 타입 import 추가
  if (paramType) imports.add(paramType);
  if (responseType && responseType !== 'void') imports.add(responseType);
  if (requestType) imports.add(requestType);

  // 함수명 생성
  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const baseFunctionName = buildFunctionName(method, functionBaseName, hasV1);
  const key = `${method}-${actualPath || baseName}`;

  // 중복 체크 및 고유 함수명 생성
  const functionName = generateUniqueFunctionName(baseFunctionName, functionNames, key, apiDescription);
  if (!functionName) return null;

  functionNames.set(functionName, key);
  return generateFunctionCodeByMethod(method, endpoint, functionName);
};

/**
 * 모든 엔드포인트 처리
 * @param {EndpointConfig[]} endpoints - 엔드포인트 배열
 * @returns {Object} imports와 functions
 */
const processAllEndpoints = endpoints => {
  const imports = new Set();
  const functionNames = new Map();

  const functions = endpoints.map(endpoint => processEndpoint(endpoint, imports, functionNames)).filter(Boolean);

  return { imports, functions };
};

// ============================================================================
// File Content Generation
// ============================================================================

/**
 * Import 문 생성
 * @param {Set<string>} imports - import할 타입 Set
 * @returns {string} import 문 문자열
 */
const generateImportStatements = imports =>
  Array.from(imports)
    .map(type => `  ${type},`)
    .join('\n');

/** workspace-auth-api 여부 (auth 예외 케이스: withCsrAuth 래핑 + process.env 기준 base URL) */
const isAuthApi = apiName => apiName === 'workspace-auth-api';

/**
 * fetch-workspace.ts 파일 내용 생성 (기본: return httpClient)
 * @param {string} apiName - API 이름
 * @param {string} baseUrlEnv - 환경변수명
 * @param {string} clientProxyPath - 클라이언트 프록시 경로
 * @returns {string} 파일 내용
 */
const createFetchWorkspaceContent = (
  apiName,
  baseUrlEnv,
  clientProxyPath,
) => {
  const authException = isAuthApi(apiName);
  const serverUrlExpr = authException
    ? "process.env.WORKSPACE_AUTH_API_URL || ''"
    : `serverEnv().${baseUrlEnv}`;
  const importServerEnv = authException ? '' : "import { serverEnv } from '@shared/config/server-env';\n";
  const importWithCsrAuth = authException
    ? "import { withCsrAuth } from '@shared/fetch/with-csr-auth';\n"
    : '';

  const returnBlock = authException
    ? `  return {
    get: withCsrAuth(httpClient.get, API_NAME),
    post: withCsrAuth(httpClient.post, API_NAME),
    put: withCsrAuth(httpClient.put, API_NAME),
    patch: withCsrAuth(httpClient.patch, API_NAME),
    delete: withCsrAuth(httpClient.delete, API_NAME),
  };`
    : '  return httpClient;';

  return `${importServerEnv}import { httpCreate } from '@shared/fetch/fetch';
import { SentryCaptureError } from '@shared/fetch/sentry';
${importWithCsrAuth}import { isServerSide } from '@jds/helper-utils';

const workspaceBaseURL = () => {
  if (isServerSide()) {
    return ${serverUrlExpr};
  }

  // 클라이언트: Next.js API Route를 통한 프록시 호출 (CORS 방지)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return \`\${origin}${clientProxyPath}\`;
};

const API_NAME = '${apiName}';

const workspaceFetch = () => {
  const httpClient = httpCreate(workspaceBaseURL(), {
    headers: {
      'Content-Type': 'application/json',
    },
    register: {
      onNetworkError: error => {
        SentryCaptureError(API_NAME, 'request', error);
        return Promise.reject(error.reason);
      },
      onError(error) {
        SentryCaptureError(API_NAME, 'response', error);
        return Promise.reject(error.reason);
      },
    },
  });

${returnBlock}
};

export { workspaceFetch };
`;
};

/**
 * workspace.fetch.ts 파일 내용 생성
 * @param {Set<string>} imports - import할 타입 Set
 * @param {string[]} functions - 함수 코드 배열
 * @param {string} fileName - 파일명
 * @param {boolean} needsPartialExcept - PartialExcept 타입 필요 여부
 * @returns {string} 파일 내용
 */
const createWorkspaceFetchContent = (imports, functions, fileName, needsPartialExcept) => {
  const folderName = fileName.replace('.fetch.ts', '');
  const fetchWorkspaceFileName = `fetch-${folderName}`;
  const helperTypesImport = needsPartialExcept ? `import type { PartialExcept } from '@jds/helper-fetchs';\n` : '';
  const importStatements = generateImportStatements(imports);

  return `${helperTypesImport}import type {
${importStatements}
} from './types';
import { workspaceFetch } from './${fetchWorkspaceFileName}';


const workspaceFetchClient = workspaceFetch();

${functions.join('\n\n')}
`;
};

// ============================================================================
// React Query Hooks Generation
// ============================================================================

/**
 * Query Key 생성
 * @param {string} functionBaseName - 함수 기본명
 * @param {boolean} hasV1 - V1 접두사 여부
 * @returns {string} Query Key
 */
const buildQueryKey = (functionBaseName, hasV1) => {
  const key = functionBaseName.toUpperCase().replace(/-/g, '_');
  return hasV1 ? `V1_${key}` : key;
};

/**
 * Hook 이름 생성
 * @param {string} method - HTTP 메서드
 * @param {string} functionBaseName - 함수 기본명
 * @param {boolean} hasV1 - V1 접두사 여부
 * @returns {string} Hook 이름
 */
const buildHookName = (method, functionBaseName, hasV1) => {
  const pascalBaseName = toPascalCase(functionBaseName);

  if (method === HTTP_METHODS.GET) {
    return hasV1 ? `useV1${pascalBaseName}Query` : `use${pascalBaseName}Query`;
  }

  const methodPrefix = method.toLowerCase();
  const capitalizedMethod = methodPrefix.charAt(0).toUpperCase() + methodPrefix.slice(1);
  return hasV1
    ? `use${capitalizedMethod}V1${pascalBaseName}Mutation`
    : `use${capitalizedMethod}${pascalBaseName}Mutation`;
};

/**
 * Query Hook 코드 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {string} hookName - Hook 이름
 * @param {string} functionName - 함수명
 * @returns {string} Hook 코드
 */
const generateQueryHookCode = (endpoint, hookName, functionName) => {
  const { actualPath, apiDescription, baseName, hasPageParam, paramType, pathParams, queryParams, responseType } =
    endpoint;

  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const queryKey = buildQueryKey(functionBaseName, hasV1);
  const pathTemplate = actualPath || (hasV1 ? `/v1/${functionBaseName}` : `/${functionBaseName}`);
  const apiComment = apiDescription
    ? `// ${apiDescription} - GET ${pathTemplate}`
    : `// ${functionBaseName} - GET ${pathTemplate}`;

  const hasPathParams = pathParams.length > 0;
  const validQueryParams = filterValidIdentifiers(queryParams);
  const hasQueryParams = validQueryParams.length > 0;

  const paramsTypeRequired = resolveParamsType(hasPageParam, paramType);
  const response = responseType || 'unknown';

  // 경로 파라미터나 쿼리 파라미터가 있는 경우
  if (hasPathParams || hasQueryParams) {
    return `${apiComment}
export const ${hookName} = (
  params: ${paramsTypeRequired},
  options?: UseQueryOptionsType<${response}>,
) => {
  return useQuery({
    queryKey: QUERY_KEY_FACTORY(QUERY_KEY.${queryKey}, params),
    queryFn: () => ${functionName}(params),
    ...options,
  });
};`;
  }

  // 경로 파라미터도 없고 쿼리 파라미터도 없는 경우 - params 없이 생성
  return `${apiComment}
export const ${hookName} = (options?: UseQueryOptionsType<${response}>) => {
  return useQuery({
    queryKey: QUERY_KEY_FACTORY(QUERY_KEY.${queryKey}),
    queryFn: () => ${functionName}(),
    ...options,
  });
};`;
};

/**
 * Mutation Hook 코드 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {string} hookName - Hook 이름
 * @param {string} functionName - 함수명
 * @returns {string} Hook 코드
 */
const generateMutationHookCode = (endpoint, hookName, functionName) => {
  const {
    actualPath,
    apiDescription,
    baseName,
    method,
    paramType,
    pathParams,
    queryParams,
    requestType,
    responseType,
  } = endpoint;

  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const pathTemplate = actualPath || (hasV1 ? `/v1/${baseName}` : `/${baseName}`);
  const apiComment = apiDescription
    ? `// ${apiDescription} - ${method} ${pathTemplate}`
    : `// ${functionBaseName} - ${method} ${pathTemplate}`;

  const hasPathParams = pathParams.length > 0;
  const validQueryParams = filterValidIdentifiers(queryParams);
  const hasQueryParams = validQueryParams.length > 0;
  const needsParams = hasPathParams || hasQueryParams || paramType;
  const hasRequestType = !!requestType;

  // DELETE 메서드는 request body가 없음
  if (method === HTTP_METHODS.DELETE) {
    return `${apiComment}
export const ${hookName} = () => {
  return useMutation({
    mutationFn: (params: ${paramType || 'Record<string, unknown>'}) =>
      ${functionName}(params),
  });
};`;
  }

  // request body와 params가 모두 있는 경우
  if (needsParams && hasRequestType) {
    return `${apiComment}
export const ${hookName} = () => {
  return useMutation({
    mutationFn: ({ data, params }: { data: ${requestType}; params: ${paramType || 'Record<string, unknown>'} }) =>
      ${functionName}(data, params),
  });
};`;
  }

  // params만 있는 경우
  if (needsParams && !hasRequestType) {
    return `${apiComment}
export const ${hookName} = () => {
  return useMutation({
    mutationFn: (params: ${paramType || 'Record<string, unknown>'}) =>
      ${functionName}(params),
  });
};`;
  }

  // request body만 있는 경우
  if (!needsParams && hasRequestType) {
    return `${apiComment}
export const ${hookName} = () => {
  return useMutation({
    mutationFn: (data: ${requestType}) =>
      ${functionName}(data),
  });
};`;
  }

  // 기본 케이스
  return `${apiComment}
export const ${hookName} = () => {
  return useMutation({
    mutationFn: (data: ${requestType || paramType || 'Record<string, unknown>'}) =>
      ${functionName}(data),
  });
};`;
};

/**
 * 엔드포인트에서 Hook 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {Set<string>} imports - import 타입 Set
 * @param {Set<string>} generatedHooks - 생성된 Hook 이름 Set
 * @returns {string|null} Hook 코드 또는 null
 */
const processEndpointToHook = (endpoint, imports, generatedHooks) => {
  const { actualPath, baseName, method, paramType, requestType, responseType } = endpoint;

  // 타입 import 추가
  if (paramType) imports.add(paramType);
  if (responseType && responseType !== 'void') imports.add(responseType);
  if (requestType) imports.add(requestType);

  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const functionName = buildFunctionName(method, functionBaseName, hasV1);
  const hookName = buildHookName(method, functionBaseName, hasV1);

  // 중복 체크
  if (generatedHooks.has(hookName)) {
    console.warn(`⚠️  중복된 Hook 건너뛰기: ${hookName}`);
    return null;
  }
  generatedHooks.add(hookName);

  return method === HTTP_METHODS.GET
    ? generateQueryHookCode(endpoint, hookName, functionName)
    : generateMutationHookCode(endpoint, hookName, functionName);
};

/**
 * workspace.client.ts 파일 내용 생성
 * @param {EndpointConfig[]} endpoints - 엔드포인트 배열
 * @param {string} fileName - 파일명
 * @param {string} dataLayer - Data layer path
 * @param {string} presentationLayer - Presentation layer path
 * @returns {string} 파일 내용
 */
const createWorkspaceClientContent = (endpoints, fileName, dataLayer, presentationLayer) => {
  const imports = new Set();
  const generatedHooks = new Set();

  const hooks = endpoints.map(endpoint => processEndpointToHook(endpoint, imports, generatedHooks)).filter(Boolean);

  const importStatements = generateImportStatements(imports);

  // 상대 경로 계산
  const projectRoot = getProjectRoot();
  const presentationLayerAbsolute = join(projectRoot, presentationLayer);
  const dataLayerAbsolute = join(projectRoot, dataLayer);
  const relativeDataPath = relative(presentationLayerAbsolute, dataLayerAbsolute).replace(/\\/g, '/');

  const fetchImportPath = fileName.replace('.client.ts', '.fetch');

  // 함수 import 생성
  const functionImports = new Set();
  endpoints.forEach(e => {
    const hasV1 = hasV1Prefix(e.paramType, e.responseType);
    const functionBaseName = e.actualPath ? pathToFunctionBaseName(e.actualPath) : e.baseName;
    const fn = buildFunctionName(e.method, functionBaseName, hasV1);
    functionImports.add(fn);
  });

  // PartialExcept는 더 이상 사용하지 않으므로 import 불필요
  const needsPartialExcept = false;
  const partialExceptImport = '';

  return `import type {
${importStatements}
} from '${relativeDataPath}/types';
import type { UseQueryOptionsType } from '../helper-types';
import { QUERY_KEY } from './querykey';
import { QUERY_KEY_FACTORY } from '../query-key-factory';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
${Array.from(functionImports)
  .map(fn => `  ${fn},`)
  .join('\n')}
} from '${relativeDataPath}/${fetchImportPath}';

${hooks.join('\n\n')}
`;
};

// ============================================================================
// Server-side Functions Generation
// ============================================================================

/**
 * Server-side prefetch 함수 코드 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {string} serverFunctionName - 서버 함수명
 * @param {string} functionName - 클라이언트 함수명
 * @returns {string} 함수 코드
 */
const generateServerFunctionCode = (endpoint, serverFunctionName, functionName) => {
  const {
    actualPath,
    allParamsRequired,
    apiDescription,
    baseName,
    hasPageParam,
    paramType,
    pathParams,
    queryParams,
    responseType,
  } = endpoint;

  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const queryKey = buildQueryKey(functionBaseName, hasV1);
  const pathTemplate = actualPath || (hasV1 ? `/v1/${baseName}` : `/${baseName}`);
  const apiComment = apiDescription
    ? `// ${apiDescription} - GET ${pathTemplate}`
    : `// ${baseName} 서버 사이드 prefetch - GET ${pathTemplate}`;

  const hasPathParams = pathParams.length > 0;
  const validQueryParams = filterValidIdentifiers(queryParams);
  const hasQueryParams = validQueryParams.length > 0;

  // 경로 파라미터도 없고 쿼리 파라미터도 없는 경우 - params 없이 생성
  if (!hasPathParams && !hasQueryParams && !paramType) {
    return `${apiComment}
export const ${serverFunctionName} = async (queryClient: QueryClient) => {
  const header = await headers();
  return queryClient.prefetchQuery({
    queryKey: QUERY_KEY_FACTORY(QUERY_KEY.${queryKey}),
    queryFn: () => ${functionName}(() => header),
  });
};`;
  }

  // 파라미터 타입 결정 (타입 정의를 그대로 사용)
  let paramsType;
  if (hasPathParams && paramType) {
    paramsType = `Partial<${paramType}>`;
  } else {
    paramsType = paramType || 'Record<string, unknown>';
  }

  // params 필수 여부 결정
  const paramsOptional = hasPathParams || allParamsRequired ? '' : '?';

  // params 타입 캐스팅
  const paramsCast =
    hasPathParams || hasQueryParams
      ? `params as ${paramType || 'Record<string, unknown>'}`
      : allParamsRequired && paramType
        ? 'params'
        : `params as ${paramType || 'Record<string, unknown>'}`;

  return `${apiComment}
export const ${serverFunctionName} = async (
  queryClient: QueryClient,
  params${paramsOptional}: ${paramsType},
) => {
  const header = await headers();
  return queryClient.prefetchQuery({
    queryKey: QUERY_KEY_FACTORY(QUERY_KEY.${queryKey}, params),
    queryFn: () =>
      ${functionName}(${paramsCast}, () => header),
  });
};`;
};

/**
 * GET 엔드포인트에서 서버 함수 생성
 * @param {EndpointConfig} endpoint - 엔드포인트 설정
 * @param {Set<string>} imports - import 타입 Set
 * @param {Set<string>} generatedFunctions - 생성된 함수명 Set
 * @returns {string|null} 함수 코드 또는 null
 */
const processEndpointToServerFunction = (endpoint, imports, generatedFunctions) => {
  const { actualPath, baseName, paramType, responseType } = endpoint;

  // 타입 import 추가
  if (paramType) imports.add(paramType);
  if (responseType && responseType !== 'void') imports.add(responseType);

  const hasV1 = hasV1Prefix(paramType, responseType);
  const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
  const functionName = buildFunctionName('get', functionBaseName, hasV1);
  const serverFunctionName = `${functionName}ServerFetchQuery`;

  // 중복 체크
  if (generatedFunctions.has(serverFunctionName)) {
    console.warn(`⚠️  중복된 서버 함수 건너뛰기: ${serverFunctionName}`);
    return null;
  }
  generatedFunctions.add(serverFunctionName);

  return generateServerFunctionCode(endpoint, serverFunctionName, functionName);
};

/**
 * workspace.server.ts 파일 내용 생성
 * @param {EndpointConfig[]} endpoints - 엔드포인트 배열
 * @param {string} fileName - 파일명
 * @param {string} dataLayer - Data layer path
 * @param {string} presentationLayer - Presentation layer path
 * @returns {string|null} 파일 내용 또는 null
 */
const createWorkspaceServerContent = (endpoints, fileName, dataLayer, presentationLayer) => {
  const getEndpoints = endpoints.filter(e => e.method === HTTP_METHODS.GET);

  if (getEndpoints.length === 0) {
    console.log('⚠️  GET 엔드포인트가 없어 workspace.server.ts를 생성하지 않습니다.');
    return null;
  }

  const imports = new Set();
  const generatedFunctions = new Set();

  const functions = getEndpoints
    .map(endpoint => processEndpointToServerFunction(endpoint, imports, generatedFunctions))
    .filter(Boolean);

  const importStatements = generateImportStatements(imports);

  // 상대 경로 계산
  const projectRoot = getProjectRoot();
  const presentationLayerAbsolute = join(projectRoot, presentationLayer);
  const dataLayerAbsolute = join(projectRoot, dataLayer);
  const relativeDataPath = relative(presentationLayerAbsolute, dataLayerAbsolute).replace(/\\/g, '/');

  const fetchImportPath = fileName.replace('.server.ts', '.fetch');

  // PartialExcept는 더 이상 사용하지 않으므로 import 불필요
  const needsPartialExcept = false;
  const helperTypesImport = '';

  // 함수 import 생성
  const serverFunctionImports = new Set();
  getEndpoints.forEach(e => {
    const hasV1 = hasV1Prefix(e.paramType, e.responseType);
    const functionBaseName = e.actualPath ? pathToFunctionBaseName(e.actualPath) : e.baseName;
    const fn = buildFunctionName('get', functionBaseName, hasV1);
    serverFunctionImports.add(fn);
  });

  return `import type {
${importStatements}
} from '${relativeDataPath}/types';
${helperTypesImport}
import type { QueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from './querykey';
import { QUERY_KEY_FACTORY } from '../query-key-factory';
import { headers } from 'next/headers';
import {
${Array.from(serverFunctionImports)
  .map(fn => `  ${fn},`)
  .join('\n')}
} from '${relativeDataPath}/${fetchImportPath}';

${functions.join('\n\n')}
`;
};

// ============================================================================
// Helper Files Generation
// ============================================================================

/**
 * query-key-factory.ts 파일 내용 생성
 * @returns {string} 파일 내용
 */
const createQueryKeyFactoryContent =
  () => `export const QUERY_KEY_FACTORY = <T, K extends string>(queryKey: K, param?: T) => {
  const base = [queryKey] as const;

  if (param && Array.isArray(param)) {
    return [...base, ...param] as const;
  }

  if (param && typeof param === 'object' && param !== null) {
    // 객체의 키를 정렬하여 일관된 queryKey 생성
    const sortedKeys = Object.keys(param).sort((a, b) => a.localeCompare(b));
    const sortedValues = sortedKeys.map(key => (param as Record<string, unknown>)[key]);
    return [...base, ...sortedValues] as const;
  }

  if (param) {
    return [...base, param] as const;
  }

  return base;
};
`;

/**
 * querykey.ts 파일 내용 생성
 * @param {EndpointConfig[]} endpoints - 엔드포인트 배열
 * @returns {string} 파일 내용
 */
const createQueryKeyContent = endpoints => {
  const getEndpoints = endpoints.filter(e => e.method === HTTP_METHODS.GET);

  const queryKeys = getEndpoints.map(endpoint => {
    const { actualPath, baseName, paramType, responseType } = endpoint;
    const hasV1 = hasV1Prefix(paramType, responseType);
    const functionBaseName = actualPath ? pathToFunctionBaseName(actualPath) : baseName;
    const queryKey = buildQueryKey(functionBaseName, hasV1);
    return `  ${queryKey}: '${queryKey}',`;
  });

  return `export const QUERY_KEY = {
${queryKeys.join('\n')}
} as const;
`;
};

/**
 * helper-types.ts 파일 내용 생성
 * @returns {string} 파일 내용
 */
const createHelperTypesContent =
  () => `import type { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import type { ComponentPropsWithoutRef, DOMAttributes, JSX, ReactNode } from 'react';

/** \`T\`의 모든 속성을 순회하며 optional로 수정 */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** 특정 key를 제외하고 optional로 변환 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** 특정 key를 제외하고 모든 속성을 optional로 변환 */
export type DeepPartialExcept<T, K extends keyof T> = DeepPartial<T> & Pick<T, K>;

/** 특정 key만 optional로 변환 */
export type PartialKeys<T, K extends keyof T> = Partial<Pick<T, Extract<keyof T, K>>> & Omit<T, K> extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

/** \`T\`와 \`K\` 모두 가지고 있는 키 반환 */
export type DuplicatedKeys<T, K> = keyof T & keyof K;

/** \`T\`와 \`K\`를 합친 타입 반환 */
export type SoftMerge<T extends Record<string, unknown>, K extends Record<string, unknown>> = {
  [key in DuplicatedKeys<T, K>]: T[key] | K[key];
} & { [key in keyof T]?: T[key] } & { [key in keyof K]?: K[key] };

/** 함수 반환값의 타입. Promise를 반환하면 Promise를 제거 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Return<T extends (...args: any) => unknown> = Awaited<ReturnType<T>>;

export type Nullable<T> = T | null;

/** 특정 key의 optional 해제 */
export type RequiredKey<T, K extends keyof T> = Required<Pick<T, K>>[K];

export type StrictPropsWithChildren<P = unknown> = P & {
  children: ReactNode;
};

type EventHandlers<T> = Omit<DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>;

export type ElementEvent<T extends keyof JSX.IntrinsicElements, E extends keyof EventHandlers<T>> = RequiredKey<
  ComponentPropsWithoutRef<T>,
  E
>;

export type UseQueryOptionsType<T> = Omit<UseQueryOptions<T, Error, T, readonly unknown[]>, 'queryKey' | 'queryFn'>;

export type UseMutationOptionsType<TData, TVariables = unknown> = Omit<
  UseMutationOptions<TData, Error, TVariables, unknown>,
  'mutationFn'
>;

export type ValueOf<T> = T[keyof T];
`;

// ============================================================================
// File Writing (Side Effects)
// ============================================================================

/**
 * 파일 쓰기 (사이드 이펙트)
 * @param {string} outputPath - 출력 경로
 * @param {string} content - 파일 내용
 * @param {string} fileName - 파일명 (로깅용)
 * @returns {void}
 */
const writeFile = (outputPath, content, fileName) => {
  console.log(`📝 ${fileName} 생성 중...`);

  // 디렉토리가 없으면 생성
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, content, 'utf-8');
  console.log(`✅ ${outputPath} 생성 완료`);
};

// ============================================================================
// Public API Functions
// ============================================================================

/**
 * Generate TypeScript types from OpenAPI schema
 *
 * Uses @comm/swagger-generator-cli to generate TypeScript type definitions
 * from OpenAPI/Swagger documentation. Supports path filtering.
 *
 * @param {string} url - OpenAPI documentation URL
 * @param {string} output - Output directory path for generated types
 * @param {string[]} includePaths - Array of API paths to include (empty = all)
 * @param {string[]} excludePaths - Array of API paths to exclude
 * @returns {void}
 * @throws {Error} When generate-schema CLI tool is not found or generation fails
 */
export function generateTypes(url, output, includePaths, excludePaths) {
  console.log('📦 OpenAPI 스키마에서 타입 생성 중...');

  const projectRoot = getProjectRoot();
  const generateSchemaPath = join(projectRoot, 'node_modules', '.bin', 'generate-schema');

  if (!existsSync(generateSchemaPath)) {
    console.error(`❌ generate-schema를 찾을 수 없습니다: ${generateSchemaPath}`);
    console.error('   @comm/swagger-generator-cli 패키지가 설치되어 있는지 확인해주세요.');
    process.exit(1);
  }

  const args = ['--docs', url, '--output', output];

  if (includePaths.length > 0) {
    includePaths.forEach(path => args.push('--strict-path', path));
  }

  if (excludePaths.length > 0) {
    excludePaths.forEach(path => args.push('--exclude-path', path));
  }

  try {
    execSync(`${generateSchemaPath} ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true,
    });
    console.log('✅ 타입 생성 완료');
  } catch (error) {
    console.error('❌ 타입 생성 실패:', error.message);
    process.exit(1);
  }
}

/**
 * Generate fetch-workspace.ts file
 *
 * Creates the base HTTP client configuration file with server/client side
 * environment handling using httpCreate from @jds/helper-fetchs
 *
 * @param {string} outputPath - Absolute path for output file
 * @param {string} apiName - API name identifier
 * @param {string} baseUrlEnv - Environment variable name for base URL
 * @param {string} clientProxyPath - Client-side proxy path
 * @returns {void}
 */
function generateFetchWorkspace(outputPath, apiName, baseUrlEnv, clientProxyPath, fileName) {
  const content = createFetchWorkspaceContent(apiName, baseUrlEnv, clientProxyPath);
  writeFile(outputPath, content, fileName);
}

/**
 * Generate workspace.fetch.ts file with API functions
 *
 * Creates typed fetch functions for all API endpoints with proper parameter handling,
 * path/query parameter separation, and request body support for mutations
 *
 * @param {string} outputPath - Absolute path for output file
 * @param {EndpointConfig[]} endpoints - Array of endpoint information
 * @param {string} typesDir - Directory path containing type definitions
 * @param {string} fileName - File name for logging
 * @returns {void}
 */
function generateWorkspaceFetch(outputPath, endpoints, typesDir, fileName) {
  const { functions, imports } = processAllEndpoints(endpoints);
  // PartialExcept는 더 이상 사용하지 않으므로 import 불필요
  const needsPartialExcept = false;
  const content = createWorkspaceFetchContent(imports, functions, fileName, needsPartialExcept);
  writeFile(outputPath, content, fileName);
}

/**
 * Generate workspace.client.ts file with React Query hooks
 *
 * Creates useQuery hooks for GET requests and useMutation hooks for POST/PUT/DELETE/PATCH.
 * Includes query key management and proper TypeScript typing
 *
 * @param {string} outputPath - Absolute path for output file
 * @param {EndpointConfig[]} endpoints - Array of endpoint information
 * @param {string} fileName - File name for logging
 * @param {string} dataLayer - Data layer path for imports
 * @param {string} presentationLayer - Presentation layer path for imports
 * @returns {void}
 */
function generateWorkspaceClient(outputPath, endpoints, fileName, dataLayer, presentationLayer) {
  const content = createWorkspaceClientContent(endpoints, fileName, dataLayer, presentationLayer);
  writeFile(outputPath, content, fileName);
}

/**
 * Generate workspace.server.ts file with server-side prefetch functions
 *
 * Creates server-side query prefetch functions for Next.js server components.
 * Only generates functions for GET endpoints
 *
 * @param {string} outputPath - Absolute path for output file
 * @param {EndpointConfig[]} endpoints - Array of endpoint information
 * @param {string} fileName - File name for logging
 * @param {string} dataLayer - Data layer path for imports
 * @param {string} presentationLayer - Presentation layer path for imports
 * @returns {void}
 */
function generateWorkspaceServer(outputPath, endpoints, fileName, dataLayer, presentationLayer) {
  const content = createWorkspaceServerContent(endpoints, fileName, dataLayer, presentationLayer);
  if (!content) return;
  writeFile(outputPath, content, fileName);
}

/**
 * Generate query-key-factory.ts file
 *
 * Creates a shared query key factory function for consistent query key generation.
 * Only creates the file if it doesn't already exist
 *
 * @param {string} outputDir - Directory path for output file
 * @returns {void}
 */
function generateQueryKeyFactory(outputDir) {
  const factoryPath = join(outputDir, 'query-key-factory.ts');
  const content = createQueryKeyFactoryContent();
  writeFile(factoryPath, content, 'query-key-factory.ts');
}

/**
 * Generate querykey.ts file with query key constants
 *
 * Creates query key constants for all GET endpoints to be used with React Query
 *
 * @param {string} outputPath - Absolute path for output file
 * @param {EndpointConfig[]} endpoints - Array of endpoint information
 * @param {string} fileName - File name for logging
 * @returns {void}
 */
function generateQueryKey(outputPath, endpoints, fileName) {
  const content = createQueryKeyContent(endpoints);
  writeFile(outputPath, content, fileName);
}

/**
 * Generate helper-types.ts file with utility type definitions
 *
 * Creates TypeScript utility types for React Query hooks and common patterns.
 * Only creates the file if it doesn't already exist
 *
 * @param {string} outputPath - Absolute path for output file
 * @returns {void}
 */
function generateHelperTypes(outputPath) {
  const content = createHelperTypesContent();
  writeFile(outputPath, content, 'helper-types.ts');
}

/**
 * Process a single API configuration and generate all files
 *
 * Main processing function that:
 * 1. Fetches OpenAPI schema
 * 2. Generates TypeScript types
 * 3. Extracts endpoints from types
 * 4. Generates fetch, client, server, and helper files
 *
 * @param {import('../../types').ApiConfig} options - API configuration options
 * @returns {Promise<string[]>} Promise resolving to array of generated file paths
 */
export async function processConfig(options) {
  const projectRoot = getProjectRoot();

  // dataLayer와 presentationLayer 설정 (하위 호환성)
  const dataLayer = options.dataLayer || options.output || './src/fetch/workspace/types';
  const presentationLayer = options.presentationLayer || options.output || './src/fetch/workspace/types';

  console.log('\n🚀 Workspace Fetch 파일 자동 생성 시작...\n');
  console.log('설정:');
  console.log(`  - OpenAPI URL: ${options.url}`);
  console.log(`  - 데이터 레이어: ${dataLayer}`);
  console.log(`  - 프레젠테이션 레이어: ${presentationLayer}`);
  console.log(`  - API 이름: ${options.apiName}`);
  console.log(`  - Base URL 환경변수: ${options.baseUrlEnv}`);
  console.log(`  - Client Proxy Path: ${options.clientProxyPath}`);
  console.log(`  - 포함 경로: ${options.includePaths.length > 0 ? options.includePaths.join(', ') : '없음'}`);
  console.log(`  - 제외 경로: ${options.excludePaths.length > 0 ? options.excludePaths.join(', ') : '없음'}`);
  console.log(`  - client.ts 생성: ${options.generateClient !== false ? '예' : '아니오'}`);
  console.log(`  - server.ts 생성: ${options.generateServer !== false ? '예' : '아니오'}\n`);

  const generatedFiles = [];

  // 0. OpenAPI 스키마 로드
  const schemaData = await fetchOpenApiSchema(options.url);

  // 1. 타입 생성 (dataLayer)
  const typesOutputDir = join(dataLayer, 'types');
  generateTypes(options.url, typesOutputDir, options.includePaths, options.excludePaths);

  // 2. 엔드포인트 추출
  const typesDir = join(projectRoot, typesOutputDir);
  if (!existsSync(typesDir)) {
    console.error(`❌ 타입 디렉토리가 존재하지 않습니다: ${typesDir}`);
    process.exit(1);
  }

  const typeFiles = readdirSync(typesDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => join(typesDir, file));
  generatedFiles.push(...typeFiles);

  const endpoints = extractEndpoints(typesDir, schemaData);

  if (endpoints.length === 0) {
    console.error('❌ 엔드포인트를 찾을 수 없습니다.');
    process.exit(1);
  }

  // 3. 파일 생성
  const dataLayerDir = join(projectRoot, dataLayer);
  const presentationLayerDir = join(projectRoot, presentationLayer);
  const folderName = basename(dataLayer);

  const fetchWorkspaceFileName = `fetch-${folderName}.ts`;
  const fetchFileName = `${folderName}.fetch.ts`;
  const clientFileName = `${folderName}.client.ts`;
  const serverFileName = `${folderName}.server.ts`;
  const queryKeyFileName = 'querykey.ts';

  // dataLayer에 생성되는 파일들
  const fetchWorkspacePath = join(dataLayerDir, fetchWorkspaceFileName);
  const fetchPath = join(dataLayerDir, fetchFileName);

  // presentationLayer에 생성되는 파일들
  const clientPath = join(presentationLayerDir, clientFileName);
  const serverPath = join(presentationLayerDir, serverFileName);
  const queryKeyPath = join(presentationLayerDir, queryKeyFileName);

  generateFetchWorkspace(
    fetchWorkspacePath,
    options.apiName,
    options.baseUrlEnv,
    options.clientProxyPath || '/bizcenter/api/display',
    fetchWorkspaceFileName,
  );
  generatedFiles.push(fetchWorkspacePath);

  generateWorkspaceFetch(fetchPath, endpoints, typesDir, fetchFileName);
  generatedFiles.push(fetchPath);

  // ⏭️ presentation 레이어 및 helper 파일 생성 비활성화 (DDP 아키텍처에서 직접 관리)
  console.log('⏭️  presentation 레이어 파일 생성을 건너뜁니다');
  console.log('    - query-key-factory.ts (client.ts에서만 사용)');
  console.log('    - helper-types.ts (client.ts에서만 사용)');
  console.log('    - querykey.ts');
  console.log('    - client.ts');
  console.log('    - server.ts');

  // const outputDir = dirname(presentationLayerDir);
  // const queryKeyFactoryPath = join(outputDir, 'query-key-factory.ts');
  // generateQueryKeyFactory(outputDir);
  // generatedFiles.push(queryKeyFactoryPath);

  // const helperTypesPath = join(outputDir, 'helper-types.ts');
  // generateHelperTypes(helperTypesPath);
  // generatedFiles.push(helperTypesPath);

  // // querykey.ts를 presentationLayer에 생성
  // generateQueryKey(queryKeyPath, endpoints, queryKeyFileName);
  // generatedFiles.push(queryKeyPath);

  // // client.ts를 presentationLayer에 생성 (옵션에 따라)
  // if (options.generateClient !== false) {
  //   generateWorkspaceClient(clientPath, endpoints, clientFileName, dataLayer, presentationLayer);
  //   generatedFiles.push(clientPath);
  // } else {
  //   console.log('⏭️  client.ts 생성을 건너뜁니다.');
  // }

  // // server.ts를 presentationLayer에 생성 (옵션에 따라)
  // if (options.generateServer !== false) {
  //   generateWorkspaceServer(serverPath, endpoints, serverFileName, dataLayer, presentationLayer);
  //   generatedFiles.push(serverPath);
  // } else {
  //   console.log('⏭️  server.ts 생성을 건너뜁니다.');
  // }

  console.log('\n✅ 파일 생성 완료!');

  // 생성된 타입 파일 자동 수정 (string, unknown 타입 처리)
  console.log('\n🔧 생성된 타입 자동 수정 중...');
  try {
    const fixTypesScriptPath = join(dirname(fileURLToPath(import.meta.url)), 'fix-generated-types.mjs');
    execSync(`node "${fixTypesScriptPath}" "${typesOutputDir}"`, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true,
    });
    console.log('✅ 타입 자동 수정 완료');
  } catch (error) {
    console.warn('⚠️  타입 자동 수정 실패 (수동 실행 필요):', error.message);
  }

  return generatedFiles;
}
