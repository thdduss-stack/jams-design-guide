/**
 * CSS 관련 유틸리티 함수들
 */

/**
 * 클래스명들을 합치는 유틸리티 함수
 *
 * undefined, null, false 값은 필터링하고 유효한 문자열만 공백으로 구분하여 합칩니다.
 *
 * @param {...(string | undefined | null | false)[]} classes - 합칠 클래스명들
 * @returns {string} 공백으로 구분된 클래스명 문자열
 *
 * @example
 * ```typescript
 * mergeClassNames('btn', 'primary', undefined, 'large') // 'btn primary large'
 * mergeClassNames('icon', null, false, 'active') // 'icon active'
 * mergeClassNames() // ''
 * ```
 */
export const mergeClassNames = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
