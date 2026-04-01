import type { BZWIconNames } from '@shared/ui/BZWIcon/constants';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * BZWIcon 컴포넌트에서 사용 가능한 아이콘 색상 타입
 *
 * JDS 테마의 jdsPaletteContract에 정의된 색상들을 기반으로 합니다.
 * 모든 색상은 디자인 시스템의 일관성을 위해 사전 정의된 값들만 사용 가능합니다.
 *
 * @example
 * ```typescript
 * // 기본 회색 계열
 * const grayColor: IconColor = 'gray700'; // 기본값
 *
 * // 강조 색상
 * const primaryColor: IconColor = 'blue700';
 * const errorColor: IconColor = 'red700';
 * ```
 */
export type IconColor =
  | 'gray900'
  | 'gray800'
  | 'gray700'
  | 'gray600'
  | 'gray500'
  | 'gray400'
  | 'gray300'
  | 'green400'
  | 'blue700'
  | 'blue650'
  | 'blue600'
  | 'blue500'
  | 'bluegray400'
  | 'bluegray500'
  | 'bluegray600'
  | 'green600'
  | 'green500'
  | 'indigo600'
  | 'orange350'
  | 'red'
  | 'red700'
  | 'red600'
  | 'red500'
  | 'white'
  | 'black'
  | 'yellow500';

/**
 * 아이콘에서 사용 가능한 크기 값들의 상수 배열
 *
 * 픽셀 단위의 크기를 문자열로 정의합니다. 모든 크기는 정사각형으로 적용되며
 * (width === height), 디자인 시스템의 일관성을 위해 사전 정의된 크기만 사용 가능합니다.
 *
 * @example
 * ```typescript
 * // Storybook controls에서 사용
 * const controls = {
 *   size: { control: { type: 'select', options: ICON_SIZES } }
 * };
 * ```
 */
export const ICON_SIZES = [
  '10',
  '12',
  '14',
  '16',
  '18',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '42',
  '48',
  '56',
  '60',
  '64',
  '80',
] as const;

/**
 * BZWIcon 컴포넌트에서 사용 가능한 아이콘 크기 타입
 *
 * ICON_SIZES 배열에서 파생되어 타입과 런타임 값이 동기화됩니다.
 *
 * @example
 * ```typescript
 * // 작은 아이콘
 * const smallSize: IconSize = '12';
 *
 * // 기본 크기 (기본값)
 * const defaultSize: IconSize = '24';
 *
 * // 큰 아이콘 (XL)
 * const largeSize: IconSize = '56';
 * ```
 */
export type IconSize = (typeof ICON_SIZES)[number];

/**
 * BZWIcon 컴포넌트의 Props 인터페이스
 *
 * HTML i 요소의 모든 속성을 상속받되, children은 제외합니다.
 * forwardRef를 통해 ref도 전달 가능하며, 추가적인 아이콘 전용 속성들을 제공합니다.
 *
 * @interface IconProps
 * @extends {Omit<ComponentPropsWithoutRef<'i'>, 'children'>}
 *
 * @example
 * ```typescript
 * // 기본 사용
 * const basicProps: IconProps = {
 *   name: 'arrow-right'
 * };
 *
 * // 모든 옵션 사용
 * const fullProps: IconProps = {
 *   name: 'special-email',
 *   size: '32',
 *   color: 'blue700',
 *   irName: '이메일',
 *   className: 'custom-icon',
 *   onClick: (e) => console.log('clicked')
 * };
 * ```
 */
export interface IconProps extends Omit<ComponentPropsWithoutRef<'i'>, 'children'> {
  /**
   * 사용할 아이콘의 이름 (필수)
   * BZWIconNames 타입에 정의된 값들만 사용 가능
   */
  name: BZWIconNames;
  /**
   * 아이콘 색상 (선택사항)
   * @default 'gray700'
   */
  color?: IconColor;
  /**
   * 아이콘 크기 (선택사항)
   * @default '24'
   */
  size?: IconSize;
  /**
   * 스크린리더용 텍스트 (접근성)
   * 제공하면 VisuallyHidden으로 렌더링되어 스크린리더에서 읽힙니다
   */
  irName?: string;
}
