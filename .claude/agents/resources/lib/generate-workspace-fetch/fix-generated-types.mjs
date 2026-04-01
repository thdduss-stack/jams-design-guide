#!/usr/bin/env node

/**
 * 생성된 타입 파일들을 자동으로 수정하여 TypeScript 제약 조건을 만족시키는 스크립트
 *
 * 수정 내용:
 * 1. unknown 타입을 Record<string, never>로 변경 (빈 객체)
 * 2. string 타입 Response를 { value: string }로 변경 (OAuth 콜백 등)
 * 3. never[] 배열을 unknown[]로 변경 (배열 아이템 타입 누락 대응)
 * 4. 기타 primitive 타입 Response를 object로 감싸기
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 타입 수정 규칙들
 */
const TYPE_FIXES = [
  {
    name: 'EmptyResponse unknown을 Record<string, never>로 변경',
    pattern: /export type (\w*EmptyResponse) = unknown;/g,
    replacement: 'export type $1 = Record<string, never>;',
    comment: '// 빈 응답 타입 (HTTP 메서드 제약 조건을 만족하기 위해 object로 정의)',
  },
  {
    name: 'Response never를 Record<string, unknown>로 변경',
    pattern: /export type (\w*Response) = never;/g,
    replacement: 'export type $1 = Record<string, unknown>;',
    comment: '// OpenAPI 스펙에 응답 스키마가 누락된 경우 (백엔드 수정 필요)',
  },
  {
    name: 'Callback Response string을 { value: string }로 변경',
    pattern: /export type (V1\w*CallbackGetResponse|V1\w*CallbackPostResponse|V1AuthnAuthorizeGetResponse) = string;/g,
    replacement: 'export type $1 = { value: string };',
    comment: '// HTML 또는 리다이렉트 URL을 문자열로 반환',
  },
  {
    name: 'never[] 배열을 unknown[]로 변경',
    pattern: /(\w+):\s*never\[\];/g,
    replacement: '$1: unknown[];',
    comment: '// 배열 아이템 타입 정보 누락 (OpenAPI 스키마 검증 필요)',
  },
  {
    name: '기타 Response unknown을 Record<string, never>로 변경',
    pattern: /export type (\w*Response) = unknown;/g,
    replacement: 'export type $1 = Record<string, never>;',
    comment: '// 응답 타입 (HTTP 메서드 제약 조건을 만족하기 위해 object로 정의)',
  },
];

/**
 * 재귀적으로 .ts 파일 찾기 (test 파일 제외)
 */
function findTypeScriptFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry !== 'node_modules' && !entry.startsWith('.')) {
        findTypeScriptFiles(fullPath, files);
      }
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.spec.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 파일 내용을 수정
 */
function fixTypeFile(filePath) {
  try {
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;
    const appliedFixes = [];

    for (const fix of TYPE_FIXES) {
      const matches = content.match(fix.pattern);
      if (matches && matches.length > 0) {
        content = content.replace(fix.pattern, (match, typeName) => {
          const replacement = fix.replacement.replace('$1', typeName);

          // 주석이 이미 있는지 확인
          const lines = content.split('\n');
          const matchIndex = lines.findIndex(line => line.includes(match));

          if (matchIndex > 0 && lines[matchIndex - 1].trim().startsWith('//')) {
            // 이미 주석이 있으면 타입만 교체
            return replacement;
          } else {
            // 주석이 없으면 추가
            return `${fix.comment}\n${replacement}`;
          }
        });

        modified = true;
        appliedFixes.push(`${fix.name} (${matches.length}개)`);
      }
    }

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      return appliedFixes;
    }

    return null;
  } catch (error) {
    console.error(`❌ 파일 처리 중 오류 발생: ${filePath}`, error.message);
    return null;
  }
}

/**
 * 메인 함수
 */
function main() {
  const args = process.argv.slice(2);
  const targetDir = args[0] || './src/core/core-data';

  console.log('🔧 생성된 타입 파일 자동 수정 시작...\n');
  console.log(`📁 대상 디렉토리: ${targetDir}\n`);

  const files = findTypeScriptFiles(path.resolve(targetDir));

  console.log(`📝 발견된 파일: ${files.length}개\n`);

  let modifiedFiles = 0;
  const allAppliedFixes = [];

  for (const file of files) {
    const appliedFixes = fixTypeFile(file);

    if (appliedFixes && appliedFixes.length > 0) {
      modifiedFiles++;
      const relativePath = path.relative(process.cwd(), file);
      console.log(`✅ ${relativePath}`);
      appliedFixes.forEach(fix => {
        console.log(`   - ${fix}`);
        if (!allAppliedFixes.includes(fix)) {
          allAppliedFixes.push(fix);
        }
      });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 처리 결과:');
  console.log(`   - 검색된 파일: ${files.length}개`);
  console.log(`   - 수정된 파일: ${modifiedFiles}개`);

  if (allAppliedFixes.length > 0) {
    console.log('\n📝 적용된 수정 규칙:');
    allAppliedFixes.forEach(fix => console.log(`   - ${fix}`));
  }

  console.log('='.repeat(60));

  if (modifiedFiles > 0) {
    console.log('\n✨ 타입 수정 완료! TypeScript 컴파일이 정상적으로 동작할 것입니다.');
  } else {
    console.log('\n✅ 수정이 필요한 타입이 없습니다.');
  }
}

try {
  main();
} catch (error) {
  console.error('❌ 스크립트 실행 중 오류 발생:', error);
  process.exit(1);
}
