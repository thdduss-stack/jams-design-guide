'use client';

import type { IconColor, IconSize } from '@shared/types/icon/icon.types';
import type { SystemIconComponents } from '../BZWSystemIcons';
import type { BZWIconNames } from './constants';
import { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { VisuallyHidden } from '@jds/visually-hidden';
import { mergeClassNames } from '../../utils/css-utils';
import './icons.css';

// SystemIconRenderer를 dynamic import로 로드하여 번들 분리
const SystemIconRenderer = dynamic(() => import('./SystemIconRenderer'), {
  ssr: false,
});

export interface BZWIconProps extends Omit<React.ComponentPropsWithoutRef<'i'>, 'children'> {
  name: BZWIconNames | keyof typeof SystemIconComponents;
  color?: IconColor;
  size?: IconSize;
  irName?: string;
}

/**
 * 아이콘 이름에 따른 CSS 클래스명을 반환하는 함수
 */
const getIconClassName = (name: BZWIconProps['name']) => {
  // system_ 아이콘은 SystemIconRenderer에서 처리되므로 여기서는 처리하지 않음
  if (typeof name === 'string' && name.startsWith('system_')) {
    return '';
  }

  // special_ 아이콘의 경우 CSS 클래스명 반환
  return `bz-icon--${name}`;
};

/**
 * BizCenter에서 사용하는 아이콘 컴포넌트
 *
 * **아이콘 타입별 렌더링 방식**:
 * - `system_` 아이콘: SystemIconRenderer로 lazy 로딩 (번들 분리)
 * - `special_` 아이콘: CSS background-image 방식으로 렌더링
 * - 기타 아이콘: img 태그로 SVG 직접 렌더링
 */
const BZWIcon = forwardRef<HTMLElement, BZWIconProps>((props, ref) => {
  const { className, color = 'gray700', irName, name, size = '24', ...iconProps } = props;

  // system_ prefix인 경우 SystemIconRenderer 사용 (lazy loading)
  if (name.startsWith('system_')) {
    return (
      <>
        <SystemIconRenderer
          className={className}
          color={color}
          name={name as keyof typeof SystemIconComponents}
          ref={ref as React.Ref<SVGSVGElement>}
          size={size}
          {...iconProps}
        />
        {irName && <VisuallyHidden>{irName}</VisuallyHidden>}
      </>
    );
  }

  const numericSize = parseInt(size);

  const iconClassName = getIconClassName(name);

  return (
    <>
      <i
        ref={ref}
        style={{ width: `${numericSize}px`, height: `${numericSize}px` }}
        className={mergeClassNames(
          'bz-icon',
          iconClassName,
          "font-normal inline-block shrink-0 select-none align-baseline font-[inherit] not-italic leading-none before:content-['']",
          className,
        )}
        {...iconProps}
      />
      {irName && <VisuallyHidden>{irName}</VisuallyHidden>}
    </>
  );
});

BZWIcon.displayName = 'BZWIcon';

export default BZWIcon;
