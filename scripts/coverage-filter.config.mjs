/**
 * Coverage 필터링 설정
 * @description filter-coverage.mjs에서 사용하는 설정값들
 */

/**
 * Coverage 임계값 (%)
 * @description 이 값보다 낮은 coverage를 가진 파일들이 리포트됩니다
 */
export const COVERAGE_THRESHOLD = 80;

/**
 * Coverage 체크에서 제외할 파일 경로 목록
 * @description 다음과 같은 경우 제외 목록에 추가합니다:
 * - GRAND 조건문 등으로 인해 커버되지 않는 브랜치가 있는 파일
 * - 환경별 분기 처리로 인해 특정 환경에서만 실행되는 코드가 있는 파일
 * - 테스트 헬퍼 파일 중 일부 브랜치가 의도적으로 커버되지 않는 경우
 *
 * @example
 * // 새 파일 추가 방법:
 * export const EXCLUDED_FILES = [
 *   'features/job-posting/model/constants.ts',
 *   'features/새기능/model/helper.ts', // 추가
 * ];
 */
export const EXCLUDED_FILES = [
  'features/job-posting/model/constants.ts',
  'features/job-posting/model/validation.test-helper.ts',
  'shared/utils/pdf-utils.ts', // pdfjs-dist 모킹 문제로 인해 일부 테스트 skip 처리
  'views/workspace/job-posting/lib/form-data-transformer.ts', // 타입 가드 분기 처리로 인해 일부 브랜치 커버 어려움
  'shared/utils/ddp-error-reporter.ts', // 개발/프로덕션 환경 분기 처리로 인해 특정 환경에서만 실행되는 코드 존재
  'views/workspace/company/model/hooks/use-company.ts', // 복잡한 옵셔널 체이닝 및 조건부 로직으로 인해 일부 브랜치 커버 어려움
];
