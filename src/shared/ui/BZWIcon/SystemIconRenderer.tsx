'use client';

import type { IconColor } from '@shared/types/icon/icon.types';
import { forwardRef } from 'react';
import { jdsPaletteContract } from '@jds/theme';
import { mergeClassNames } from '../../utils/css-utils';
import { SystemIconComponents } from '../BZWSystemIcons';

interface SystemIconRendererProps {
  name: keyof typeof SystemIconComponents;
  color?: IconColor;
  size?: string;
  className?: string;
}

const palette = jdsPaletteContract as Record<string, string>;

const colorMap = {
  gray900: jdsPaletteContract.grayGray900,
  gray800: jdsPaletteContract.grayGray800,
  gray700: jdsPaletteContract.grayGray700,
  gray600: 'var(--palette-gray-gray600)',
  gray500: jdsPaletteContract.grayGray500,
  gray400: jdsPaletteContract.grayGray400,
  gray300: jdsPaletteContract.grayGray300,
  green400: palette.greenGreen400 ?? 'var(--palette-green-green400)',
  green600: jdsPaletteContract.greenGreen600,
  green500: jdsPaletteContract.greenGreen500,
  bluegray400: jdsPaletteContract.bluegrayBluegray400,
  bluegray500: jdsPaletteContract.bluegrayBluegray500,
  bluegray600: jdsPaletteContract.bluegrayBluegray600,
  blue700: jdsPaletteContract.blueBlue700,
  blue650: jdsPaletteContract.blueBlue650,
  blue600: jdsPaletteContract.blueBlue600,
  blue500: jdsPaletteContract.blueBlue500,
  indigo600: jdsPaletteContract.indigoIndigo600,
  orange350: jdsPaletteContract.orangeOrange350,
  red700: jdsPaletteContract.redRed300,
  red600: jdsPaletteContract.redRed600,
  red500: jdsPaletteContract.redRed200,
  white: jdsPaletteContract.baseWhite,
  black: jdsPaletteContract.baseBlack,
  yellow500: jdsPaletteContract.yellowYellow500,
  red: jdsPaletteContract.redRed,
};

const SystemIconRenderer = forwardRef<SVGSVGElement, SystemIconRendererProps>(
  ({ className, color = 'gray700', name, size = '24', ...props }, ref) => {
    const SystemComponent = SystemIconComponents[name];

    if (!SystemComponent) {
      return null;
    }

    const numericSize = Number.parseInt(size);

    return (
      <SystemComponent
        className={mergeClassNames('bz-icon', `bz-icon--${name}`, className)}
        color={colorMap[color as keyof typeof colorMap]}
        ref={ref}
        size={numericSize}
        {...props}
      />
    );
  },
);

SystemIconRenderer.displayName = 'SystemIconRenderer';

export default SystemIconRenderer;
