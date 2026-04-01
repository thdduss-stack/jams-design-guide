/**
 * BZWIcon SVG 아이콘 자동 생성 스크립트
 *
 * public/assets/images/svg 폴더의 SVG 파일들을 스캔하여
 * 단일 컴포넌트 + 아이콘 데이터 방식으로 생성합니다.
 *
 * @author BizCenter Frontend Team
 * @version 2.0.0
 */

import fs from 'fs';

// 프로젝트 설정
const imageSvgPath = './public/assets/images/svg';
const assetPath = '/assets/images/svg';
const outputCssPath = './src/shared/ui/BZWIcon/icons.css';
const outputNamesPath = './src/shared/ui/BZWIcon/constants.ts';
const outputSystemComponentsPath = './src/shared/ui/BZWSystemIcons/index.tsx';

/**
 * SVG 파일명을 아이콘 이름으로 변환
 *
 * 파일 확장자를 제거하고 하이픈을 언더스코어로 변경합니다.
 *
 * @param {string} svgFileName - SVG 파일명 (확장자 포함)
 * @returns {string} 변환된 아이콘 이름
 *
 * @example
 * ```javascript
 * svgNameToIconName('special_email.svg') // 'special_email'
 * svgNameToIconName('system_user.svg') // 'system_user'
 * ```
 */
function svgNameToIconName(svgFileName) {
  return svgFileName.replace('.svg', '').replace(/-/g, '_');
}

/**
 * 아이콘 이름을 CSS 클래스명으로 변환
 *
 * 언더스코어를 카멜 케이스로 변환하여 JavaScript에서 사용 가능한 변수명으로 만듭니다.
 *
 * @param {string} iconName - 언더스코어로 구분된 아이콘 이름
 * @returns {string} 카멜 케이스로 변환된 CSS 클래스명
 *
 * @example
 * ```javascript
 * iconNameToCssClass('special_email') // 'specialEmail'
 * iconNameToCssClass('system_user') // 'systemUser'
 * ```
 */
function iconNameToCssClass(iconName) {
  return iconName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * SVG 파일들로부터 일반 CSS 스타일을 생성
 *
 * 각 SVG 파일에 대해 CSS 클래스를 생성합니다.
 * 모든 아이콘은 contain 크기 조정을 사용하며, Tailwind CSS와 함께 사용할 수 있도록 설계되었습니다.
 *
 * @param {string[]} svgs - 처리할 SVG 파일명 배열
 * @returns {string} 생성된 CSS 코드 문자열
 *
 * @example
 * ```javascript
 * const svgFiles = ['special_email.svg', 'special_cursor.svg'];
 * const cssCode = generateCss(svgFiles);
 * // 결과: CSS 클래스 정의를 포함한 코드
 * ```
 */
function generateCss(svgs) {
  const header = `/**
 * BZWIcon 자동 생성된 아이콘 스타일 정의
 * 
 * 이 파일은 scripts/bizcenter/create-svg-css.js에 의해 자동 생성됩니다.
 * public/assets/images/svg 폴더의 SVG 파일들을 기반으로 CSS 클래스를 생성하며,
 * 수동으로 편집하면 스크립트 실행 시 덮어쓰여집니다.
 * 
 * @fileoverview 자동 생성된 아이콘 CSS 스타일
 * @readonly
 */

`;

  let styles = '';
  const classMappings = [];

  for (const svgFile of svgs) {
    const iconName = svgNameToIconName(svgFile);
    const cssClassName = `.bz-icon--${iconName}`;
    const size = '24px'; // 기본값 24px 적용
    const backgroundSize = 'contain';

    styles += `${cssClassName} {\n`;
    styles += `  background-image: url("${assetPath}/${svgFile}");\n`;
    styles += `  background-repeat: no-repeat;\n`;
    styles += `  background-position: 50% 50%;\n`;
    styles += `  background-size: ${backgroundSize};\n`;
    styles += `  width: ${size};\n`;
    styles += `  height: ${size};\n`;
    styles += `}\n\n`;

    classMappings.push({ iconName, cssClassName: `bz-icon--${iconName}` });
  }

  return header + styles;
}

/**
 * SVG 파일들로부터 TypeScript 아이콘 이름 상수와 타입을 생성
 *
 * SVG 파일명을 아이콘 이름으로 변환하고, 이를 TypeScript 상수 배열과 유니온 타입으로 생성합니다.
 *
 * @param {string[]} svgs - SVG 파일명 배열
 * @returns {string} 생성된 TypeScript 코드 문자열 (상수 배열과 타입 정의 포함)
 *
 * @example
 * ```javascript
 * const svgFiles = ['special_email.svg', 'special_cursor.svg'];
 * const tsCode = generateIconNames(svgFiles);
 * // 결과: BIZCENTER_ICON_NAMES 배열과 BZWIconNames 타입 정의
 * ```
 */
function generateIconNames(svgs) {
  const iconNames = svgs.map(svgFile => svgNameToIconName(svgFile));

  return `/**
 * 자동 생성된 BizCenter 아이콘 이름들의 상수 배열
 * 
 * 이 파일은 scripts/bizcenter/create-svg-css.js에 의해 자동 생성됩니다.
 * public/assets/images/svg 폴더의 SVG 파일들을 기반으로 생성되며,
 * 수동으로 편집하면 스크립트 실행 시 덮어쓰여집니다.
 * 
 * @readonly
 */
export const BIZCENTER_ICON_NAMES = ${JSON.stringify(iconNames, null, 2)} as const;

/**
 * BIZCENTER_ICON_NAMES 배열로부터 생성된 아이콘 이름 유니온 타입
 * 
 * TypeScript에서 아이콘 이름의 타입 안전성을 보장하기 위해 사용됩니다.
 * BZWIcon 컴포넌트의 name prop에서 사용 가능한 모든 아이콘 이름을 나타냅니다.
 * 
 * @example
 * \`\`\`typescript
 * const iconName: BZWIconNames = 'special_email'; // ✅ 유효
 * const invalidIcon: BZWIconNames = 'invalid-icon'; // ❌ 타입 에러
 * \`\`\`
 */
export type BZWIconNames = typeof BIZCENTER_ICON_NAMES[number];
`;
}

/**
 * SVG 파일을 파싱하여 path 정보와 viewBox를 추출
 *
 * SVG 파일에서 path 요소들과 viewBox 속성을 추출하여 React 컴포넌트 생성에 필요한 정보를 반환합니다.
 *
 * @param {string} svgFileName - 파싱할 SVG 파일명
 * @returns {Object|null} SVG 정보 객체 또는 null (오류 시)
 * @returns {string} returns.viewBox - SVG viewBox 속성값
 * @returns {Array<Object>} returns.paths - path 요소들의 정보 배열
 *
 * @example
 * ```javascript
 * const svgInfo = parseSvgFile('system_user.svg');
 * // 결과: { viewBox: '0 0 24 24', paths: [{ d: '...', fill: '...', stroke: '...' }] }
 * ```
 */
function parseSvgFile(svgFileName) {
  const svgFilePath = `${imageSvgPath}/${svgFileName}`;

  if (!fs.existsSync(svgFilePath)) {
    console.warn(`SVG 파일이 존재하지 않습니다: ${svgFilePath}`);
    return null;
  }

  try {
    const svgContent = fs.readFileSync(svgFilePath, 'utf8');

    // viewBox 추출
    const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

    // path 요소들 추출
    const pathRegex = /<path[^>]*>/g;
    const pathMatches = svgContent.match(pathRegex) || [];

    const paths = pathMatches.map(pathElement => {
      const pathInfo = {};

      // d 속성 추출
      const dMatch = pathElement.match(/d="([^"]*)"/);
      if (dMatch) pathInfo.d = dMatch[1];

      // fill 속성 추출
      const fillMatch = pathElement.match(/fill="([^"]*)"/);
      if (fillMatch) {
        const fillValue = fillMatch[1];
        // currentColor 또는 색상이 아닌 값들을 색상 변수로 변환
        if (fillValue === 'currentColor' || fillValue === 'inherit') {
          pathInfo.fill = 'currentColor';
        } else if (fillValue !== 'none' && fillValue !== 'transparent') {
          pathInfo.fill = 'currentColor'; // 모든 색상을 currentColor로 변환
        } else {
          pathInfo.fill = fillValue;
        }
      }

      // stroke 속성 추출
      const strokeMatch = pathElement.match(/stroke="([^"]*)"/);
      if (strokeMatch) {
        const strokeValue = strokeMatch[1];
        // currentColor 또는 색상이 아닌 값들을 currentColor로 변환
        if (strokeValue === 'currentColor' || strokeValue === 'inherit') {
          pathInfo.stroke = 'currentColor';
        } else if (strokeValue !== 'none' && strokeValue !== 'transparent') {
          pathInfo.stroke = 'currentColor'; // 모든 색상을 currentColor로 변환
        } else {
          pathInfo.stroke = strokeValue;
        }
      }

      // stroke-width 속성 추출
      const strokeWidthMatch = pathElement.match(/stroke-width="([^"]*)"/);
      if (strokeWidthMatch) pathInfo.strokeWidth = strokeWidthMatch[1];

      // fill-rule 속성 추출
      const fillRuleMatch = pathElement.match(/fill-rule="([^"]*)"/);
      if (fillRuleMatch) pathInfo.fillRule = fillRuleMatch[1];

      // clip-rule 속성 추출
      const clipRuleMatch = pathElement.match(/clip-rule="([^"]*)"/);
      if (clipRuleMatch) pathInfo.clipRule = clipRuleMatch[1];

      return pathInfo;
    });

    return { viewBox, paths };
  } catch (error) {
    console.error(`❌ SVG 파싱 중 오류 발생: ${svgFileName}`, error.message);
    return null;
  }
}

/**
 * 최적화된 system_ 아이콘 컴포넌트를 생성
 *
 * system_ 접두사를 가진 SVG 파일들을 파싱하여 최적화된 React 컴포넌트로 생성합니다.
 * 공통 BaseIcon 컴포넌트를 사용하여 코드 중복을 제거하고, 개별 컴포넌트와 통합 SystemIcon 컴포넌트를 모두 제공합니다.
 *
 * @param {string[]} systemSvgFiles - system_ 접두사 SVG 파일명 배열
 * @returns {string} 생성된 React 컴포넌트들의 TypeScript 코드
 *
 * @example
 * ```javascript
 * const systemFiles = ['system_user.svg', 'system_camera.svg'];
 * const components = generateOptimizedSystemIconComponents(systemFiles);
 * // 결과: BaseIcon, 개별 컴포넌트들, SystemIcon 통합 컴포넌트, 타입 정의를 포함한 TypeScript 코드
 * ```
 */
function generateOptimizedSystemIconComponents(systemSvgFiles) {
  const header = `/**
 * 자동 생성된 System 아이콘 React 컴포넌트들
 *
 * 이 파일은 scripts/bizcenter/create-svg-css.js에 의해 자동 생성됩니다.
 * public/assets/images/svg 폴더의 system_ 접두사 SVG 파일들을 기반으로 생성되며,
 * 수동으로 편집하면 스크립트 실행 시 덮어쓰여집니다.
 *
 * @fileoverview 자동 생성된 system_ 아이콘 React 컴포넌트들
 * @readonly
 */
import type { SVGAttributes } from 'react';
import React, { forwardRef } from 'react';

/**
 * System 아이콘 컴포넌트의 공통 Props 인터페이스
 */
export interface SystemIconProps {
  /** 아이콘 색상 (기본값: "#1976d2") */
  color?: string;
  /** 아이콘 크기 (기본값: 24) */
  size?: number | string;
  /** 추가 CSS 클래스명 */
  className?: string;
}

/**
 * 아이콘 path 데이터 인터페이스
 */
interface IconPathData {
  d?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  fillRule?: SVGAttributes<SVGPathElement>['fillRule'];
  clipRule?: string;
}

/**
 * 아이콘 데이터 인터페이스
 */
interface IconData {
  paths: IconPathData[];
}

`;

  // 아이콘 데이터 객체 생성
  let iconDataObject = '/**\n * System 아이콘 데이터 객체\n */\nconst SystemIconData: Record<string, IconData> = {\n';
  const componentNames = [];

  for (const svgFile of systemSvgFiles) {
    const iconName = svgNameToIconName(svgFile);
    const componentName = iconName
      .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const svgInfo = parseSvgFile(svgFile);
    if (!svgInfo) {
      console.warn(`⚠️ SVG 파싱 실패로 컴포넌트 생성 건너뜀: ${svgFile}`);
      continue;
    }

    // 아이콘 데이터 추가
    iconDataObject += `  '${iconName}': {\n`;
    iconDataObject += `    paths: [\n`;

    for (const path of svgInfo.paths) {
      iconDataObject += `      {\n`;
      if (path.d) iconDataObject += `        d: '${path.d}',\n`;
      if (path.fill) iconDataObject += `        fill: '${path.fill}',\n`;
      if (path.stroke) iconDataObject += `        stroke: '${path.stroke}',\n`;
      if (path.strokeWidth) iconDataObject += `        strokeWidth: '${path.strokeWidth}',\n`;
      if (path.fillRule) iconDataObject += `        fillRule: '${path.fillRule}',\n`;
      if (path.clipRule) iconDataObject += `        clipRule: '${path.clipRule}',\n`;
      iconDataObject += `      },\n`;
    }

    iconDataObject += `    ],\n`;
    iconDataObject += `  },\n`;

    componentNames.push({ iconName, componentName });
  }

  iconDataObject += `} as const;\n\n`;

  // BaseIcon 컴포넌트 생성
  const baseIconComponent = `/**
 * 공통 Base 아이콘 컴포넌트
 */
const BaseIcon = forwardRef<SVGSVGElement, SystemIconProps & { iconData: IconData }>(
  ({ className, color = '#1976d2', iconData, size = 24, ...props }, ref) => {
    return (
      <svg
        className={className}
        fill="none"
        height={size}
        ref={ref}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {iconData.paths.map((path, index) => (
          <path
            clipRule={path.clipRule}
            d={path.d}
            fill={path.fill === 'currentColor' ? color : path.fill}
            fillRule={path.fillRule}
            key={index}
            stroke={path.stroke === 'currentColor' ? color : path.stroke}
            strokeWidth={path.strokeWidth}
          />
        ))}
      </svg>
    );
  },
);

BaseIcon.displayName = 'BaseIcon';

`;

  // 개별 컴포넌트들 생성 (매우 간단해짐)
  let individualComponents = '';
  for (const { componentName, iconName } of componentNames) {
    individualComponents += `/**
 * ${componentName} 아이콘 컴포넌트
 *
 * 원본 파일: ${iconName.replace(/_/g, '_')}.svg
 */
export const ${componentName} = forwardRef<SVGSVGElement, SystemIconProps>(
  (props, ref) => {
    return <BaseIcon iconData={SystemIconData['${iconName}']} ref={ref} {...props} />;
  },
);

${componentName}.displayName = '${componentName}';

`;
  }

  // 단일 SystemIcon 컴포넌트
  const systemIconComponent = `/**
 * 통합 System 아이콘 컴포넌트
 * 
 * @example
 * <SystemIcon name="system_camera" color="#ff0000" size={32} />
 */
export interface SystemIconComponentProps extends SystemIconProps {
  /** 아이콘 이름 */
  name: SystemIconName;
}

export const SystemIcon = forwardRef<SVGSVGElement, SystemIconComponentProps>(
  ({ name, ...props }, ref) => {
    const iconData = SystemIconData[name];
    if (!iconData) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(\`Unknown system icon: \${name}\`);
      }
      return null;
    }
    return <BaseIcon iconData={iconData} ref={ref} {...props} />;
  },
);

SystemIcon.displayName = 'SystemIcon';

`;

  // 컴포넌트 매핑 객체와 타입
  let componentMapping = `// System 아이콘 컴포넌트 매핑\nexport const SystemIconComponents = {\n`;
  for (const { componentName, iconName } of componentNames) {
    componentMapping += `  '${iconName}': ${componentName},\n`;
  }
  componentMapping += `} as const;\n\n`;

  componentMapping += `// System 아이콘 이름 타입\nexport type SystemIconName = keyof typeof SystemIconComponents;\n\n`;

  // 아이콘 이름 배열 export
  const iconNamesArray = componentNames.map(({ iconName }) => `'${iconName}'`).join(', ');
  componentMapping += `// System 아이콘 이름 배열\nexport const SYSTEM_ICON_NAMES = [${iconNamesArray}] as const;\n`;

  return header + iconDataObject + baseIconComponent + individualComponents + systemIconComponent + componentMapping;
}

/**
 * 지정된 디렉토리에서 SVG 파일 목록을 가져오기
 *
 * imageSvgPath 디렉토리를 스캔하여 .svg 확장자를 가진 파일들만 필터링하여 반환합니다.
 * 디렉토리가 존재하지 않으면 경고 메시지를 출력하고 빈 배열을 반환합니다.
 *
 * @returns {string[]} SVG 파일명 배열 (확장자 포함)
 *
 * @example
 * ```javascript
 * const svgFiles = getSvgFiles();
 * // 결과: ['special_email.svg', 'system_user.svg', ...]
 * ```
 */
function getSvgFiles() {
  if (!fs.existsSync(imageSvgPath)) {
    console.warn(`SVG 디렉토리가 존재하지 않습니다: ${imageSvgPath}`);
    return [];
  }

  const files = fs.readdirSync(imageSvgPath);
  return files.filter(file => file.endsWith('.svg'));
}

/**
 * 스크립트의 메인 실행 함수
 *
 * SVG 파일 스캔부터 CSS 생성, 타입 정의 생성, React 컴포넌트 생성까지의
 * 전체 아이콘 생성 프로세스를 순차적으로 실행합니다.
 *
 * 실행 순서:
 * 1. SVG 파일 목록 가져오기
 * 2. special_ 아이콘들을 CSS로 생성
 * 3. 아이콘 이름 타입 정의 파일 생성
 * 4. system_ 아이콘들을 React 컴포넌트로 생성
 *
 * @example
 * ```javascript
 * main(); // 전체 아이콘 생성 프로세스 실행
 * ```
 */
function main() {
  console.log('🚀 SVG 아이콘 CSS 생성을 시작합니다...');

  // SVG 파일 목록 가져오기
  const svgFiles = getSvgFiles();

  if (svgFiles.length === 0) {
    console.log('SVG 파일이 없습니다.');
    return;
  }

  console.log(`${svgFiles.length}개의 SVG 파일을 찾았습니다:`, svgFiles);

  // system_ 아이콘들 필터링
  const systemSvgFiles = svgFiles.filter(file => file.includes('system_'));

  console.log(`${systemSvgFiles.length}개의 system_ 아이콘을 찾았습니다:`, systemSvgFiles);

  // 아이콘 이름 변환

  // special_ 아이콘들만 CSS로 생성 (system_ 아이콘은 React 컴포넌트로만 사용)
  const specialSvgFiles = svgFiles.filter(file => file.includes('special_'));
  console.log(`${specialSvgFiles.length}개의 special_ 아이콘을 CSS로 생성합니다:`, specialSvgFiles);

  const cssContent = generateCss(specialSvgFiles);
  fs.writeFileSync(outputCssPath, cssContent);
  console.log(`✅ CSS 파일이 생성되었습니다: ${outputCssPath}`);

  // 아이콘 이름 파일 생성 (special_ 아이콘만)
  const namesContent = generateIconNames(specialSvgFiles);
  fs.writeFileSync(outputNamesPath, namesContent);
  console.log(`✅ 아이콘 이름 파일이 생성되었습니다: ${outputNamesPath}`);

  //  System 아이콘 React 컴포넌트 생성
  if (systemSvgFiles.length > 0) {
    console.log('\n🎨 System 아이콘 React 컴포넌트 생성 중...');

    // 출력 디렉토리 생성 (없으면)
    const systemComponentsDir = outputSystemComponentsPath.substring(0, outputSystemComponentsPath.lastIndexOf('/'));
    if (!fs.existsSync(systemComponentsDir)) {
      fs.mkdirSync(systemComponentsDir, { recursive: true });
      console.log(`📁 디렉토리 생성됨: ${systemComponentsDir}`);
    }

    const systemComponentsContent = generateOptimizedSystemIconComponents(systemSvgFiles);
    fs.writeFileSync(outputSystemComponentsPath, systemComponentsContent);
    console.log(`🎨 System 아이콘 컴포넌트 파일이 생성되었습니다: ${outputSystemComponentsPath}`);

    // 생성된 컴포넌트 목록 출력
    const componentNames = systemSvgFiles.map(file => {
      const iconName = svgNameToIconName(file);
      return iconName
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
    });
    console.log(`📋 생성된 System 컴포넌트들: ${componentNames.join(', ')}`);
  }

  console.log('\n✅ SVG 아이콘 CSS 및 컴포넌트 생성이 완료되었습니다!');
}

// 스크립트 실행
main();
