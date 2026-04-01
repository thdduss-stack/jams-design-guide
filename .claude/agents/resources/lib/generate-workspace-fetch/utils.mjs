/**
 * @fileoverview Utility functions and helpers for workspace fetch generator
 * @module lib/utils
 * @requires child_process
 */

import { execSync } from 'child_process';
import { getProjectRoot } from './config.mjs';

/**
 * Korean to English keyword mapping for function naming
 *
 * @type {import('../../types').KeywordMap}
 */
export const koreanToEnglishMap = {
  조회: 'Get',
  생성: 'Create',
  수정: 'Update',
  삭제: 'Delete',
  등록: 'Register',
  재등록: 'Repost',
  단건: 'Single',
  다중: 'Multiple',
  목록: 'List',
  리스트: 'List',
  상세: 'Detail',
  요청: 'Request',
  완료: 'Complete',
  취소: 'Cancel',
  확인: 'Confirm',
  거부: 'Reject',
  변경: 'Change',
  검색: 'Search',
  필터: 'Filter',
  정렬: 'Sort',
  페이징: 'Paging',
  권한: 'Authority',
  설정: 'Setting',
  정보: 'Info',
  상태: 'Status',
  이력: 'History',
  로그: 'Log',
};

/**
 * Convert kebab-case string to PascalCase
 *
 * @param {string} str - Kebab-case string (e.g., 'user-profile')
 * @returns {string} PascalCase string (e.g., 'UserProfile')
 *
 * @example
 * toPascalCase('user-profile');
 * // Returns: 'UserProfile'
 *
 * @example
 * toPascalCase('api-key');
 * // Returns: 'ApiKey'
 */
export function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Convert kebab-case string to camelCase
 *
 * @param {string} str - Kebab-case string (e.g., 'user-profile')
 * @returns {string} camelCase string (e.g., 'userProfile')
 *
 * @example
 * toCamelCase('user-profile');
 * // Returns: 'userProfile'
 *
 * @example
 * toCamelCase('api-key');
 * // Returns: 'apiKey'
 */
export function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Extract keywords from API description for function naming
 *
 * Extracts Korean keywords and converts them to English,
 * also extracts any English words from the description
 *
 * @param {string} description - API description (e.g., '공고 API-공고 조회')
 * @returns {string} Extracted keyword in PascalCase (e.g., 'Get')
 *
 * @example
 * extractKeywordFromDescription('사용자 API-사용자 조회');
 * // Returns: 'Get'
 *
 * @example
 * extractKeywordFromDescription('회사 API-회사 정보 수정');
 * // Returns: 'UpdateInfo'
 *
 * @example
 * extractKeywordFromDescription('No description');
 * // Returns: ''
 */
export function extractKeywordFromDescription(description) {
  if (!description) return '';

  // "공고 API-공고 조회" 형식에서 마지막 부분 추출
  const parts = description.split('-');
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();

    // 한글 키워드를 영어로 변환
    let keyword = '';
    for (const [korean, english] of Object.entries(koreanToEnglishMap)) {
      if (lastPart.includes(korean)) {
        keyword += english;
      }
    }

    // 영어 단어 추출 (괄호 안 단어 포함)
    const englishWords = lastPart.match(/[A-Za-z]+/g);
    if (englishWords) {
      keyword += englishWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
    }

    return keyword;
  }

  return '';
}

/**
 * Apply ESLint and Prettier formatting to generated files
 *
 * Runs prettier --write and eslint --fix on all generated files
 * Converts absolute paths to relative paths before processing
 *
 * @param {string[]} generatedFiles - Array of absolute file paths
 * @returns {void}
 *
 * @example
 * applyLintingAndFormatting([
 *   '/path/to/project/src/file1.ts',
 *   '/path/to/project/src/file2.ts'
 * ]);
 */
export function applyLintingAndFormatting(generatedFiles) {
  if (generatedFiles.length === 0) {
    return;
  }

  const projectRoot = getProjectRoot();

  // eslint-disable-next-line no-console
  console.log('\n🔧 생성된 파일에 ESLint 및 Prettier 적용 중...\n');

  // 생성된 파일들을 상대 경로로 변환
  const relativeFiles = generatedFiles.map(file => {
    return file.replace(projectRoot + '/', '');
  });

  try {
    // Prettier 적용
    // eslint-disable-next-line no-console
    console.log('📝 Prettier 적용 중...');
    const prettierCmd = `npx prettier --write ${relativeFiles.map(f => `"${f}"`).join(' ')}`;
    execSync(prettierCmd, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true,
    });
    // eslint-disable-next-line no-console
    console.log('✅ Prettier 적용 완료');

    // ESLint 적용 (--fix 옵션으로 자동 수정)
    // eslint-disable-next-line no-console
    console.log('\n🔍 ESLint 적용 중...');
    const eslintCmd = `npx eslint --fix ${relativeFiles.map(f => `"${f}"`).join(' ')}`;
    execSync(eslintCmd, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: true,
    });
    // eslint-disable-next-line no-console
    console.log('✅ ESLint 적용 완료');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('⚠️  ESLint 또는 Prettier 적용 중 오류 발생:', error.message);
    // eslint-disable-next-line no-console
    console.warn('   생성된 파일은 정상적으로 생성되었지만 포맷팅에 실패했습니다.');
  }
}
