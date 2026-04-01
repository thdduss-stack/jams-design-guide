#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DESIGN_TOKENS_CSS_PATH = path.join(ROOT_DIR, 'src/app/design-tokens.css');
const OUTPUT_CONFIG_PATH = path.join(ROOT_DIR, 'tailwind.config.mjs');

/**
 * CSS 파일에서 CSS 변수 추출
 */
function parseCssVariables(cssContent) {
  const result = {
    primitive: {},
    themes: {},
  };

  // :root 블록 파싱
  const rootMatch = cssContent.match(/:root\s*{([^}]*)}/s);
  if (rootMatch) {
    const declarations = rootMatch[1].match(/--[\w-]+:\s*[^;]+;/g) || [];
    declarations.forEach(decl => {
      const [key, value] = decl.split(':').map(s => s.trim());
      const varName = key.replace(/^--/, '');
      result.primitive[varName] = value.replace(/;$/, '');
    });
  }

  // 테마 블록 파싱
  const themeRegex = /\[data-jds-theme="(\w+)"\]\s*{([^}]*)}/gs;
  let themeMatch;
  while ((themeMatch = themeRegex.exec(cssContent)) !== null) {
    const themeName = themeMatch[1];
    const declarations = themeMatch[2].match(/--[\w-]+:\s*[^;]+;/g) || [];
    result.themes[themeName] = {};
    declarations.forEach(decl => {
      const [key, value] = decl.split(':').map(s => s.trim());
      const varName = key.replace(/^--/, '');
      result.themes[themeName][varName] = value.replace(/;$/, '');
    });
  }

  return result;
}

/**
 * 값이 숫자 + px 형태인지 확인
 */
function isPxValue(value) {
  return /^-?\d+(\.\d+)?px$/.test(value);
}

/**
 * 값이 색상 코드인지 확인
 */
function isColorValue(value) {
  return /^#[0-9a-fA-F]{6,8}$/.test(value);
}

/**
 * kebab-case를 nested object path로 변환
 * palette-blue-blue500 -> ['blue', '500']
 * palette-gray-gray50 -> ['gray', '50']
 */
function parseTokenPath(tokenName) {
  const parts = tokenName.split('-');

  // palette 색상의 경우 중복된 이름 제거
  if (parts[0] === 'palette' && parts.length >= 3) {
    const colorGroup = parts[1]; // gray, blue, orange 등
    const lastPart = parts[parts.length - 1]; // gray50, blue500 등

    // lastPart에서 colorGroup 제거
    if (lastPart.startsWith(colorGroup)) {
      const value = lastPart.replace(colorGroup, '');
      return [colorGroup, value];
    }
  }

  return parts;
}

/**
 * nested object에 값 설정
 */
function setNestedValue(obj, path, value) {
  const keys = typeof path === 'string' ? parseTokenPath(path) : path;
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}

/**
 * Primitive 토큰을 Tailwind 설정으로 변환 (CSS 변수 참조)
 */
function convertPrimitiveTokens(primitiveTokens) {
  const config = {
    colors: {},
    spacing: {},
    borderRadius: {},
    fontSize: {},
    fontWeight: {},
    borderWidth: {},
  };

  const typographyVariants = {};

  for (const [key, value] of Object.entries(primitiveTokens)) {
    const parts = key.split('-');
    const category = parts[0];

    // Colors
    if (category === 'palette') {
      // palette-gray-gray50 -> [gray, 50]
      // palette-blue-blue500 -> [blue, 500]
      if (parts.length >= 3) {
        const colorGroup = parts[1]; // gray, blue, orange 등
        const lastPart = parts[parts.length - 1]; // gray50, blue500 등

        // lastPart에서 colorGroup 접두사 제거
        let colorKey = lastPart;
        if (lastPart.toLowerCase().startsWith(colorGroup.toLowerCase())) {
          colorKey = lastPart.slice(colorGroup.length);
        }

        // colorKey가 비어있으면 DEFAULT로 설정
        if (!colorKey) {
          colorKey = 'DEFAULT';
        }

        // CSS 변수 참조로 설정
        setNestedValue(config.colors, [colorGroup, colorKey], `var(--${key})`);
      } else {
        // palette-base-black 같은 경우
        const colorPath = parts.slice(1);
        setNestedValue(config.colors, colorPath, `var(--${key})`);
      }
    }
    // Spacing
    else if (category === 'space') {
      const spacingKey = parts[parts.length - 1].replace('space', '');
      const varRef = `var(--${key})`;
      // minus 처리
      if (spacingKey.startsWith('minus')) {
        const num = spacingKey.replace('minus', '');
        config.spacing[`-${num}`] = varRef;
      } else {
        config.spacing[spacingKey] = varRef;
      }
    }
    // Border Radius
    else if (category === 'radius') {
      const radiusKey = parts[parts.length - 1].replace('radius', '');
      config.borderRadius[radiusKey] = `var(--${key})`;
    }
    // Border Width
    else if (category === 'box' && parts[1] === 'bodersize') {
      const widthKey = parts[parts.length - 1].replace('size', '');
      config.borderWidth[widthKey] = `var(--${key})`;
    }
    // Typography Variants (조합 필요)
    else if (category === 'typography' && parts[1] === 'variant') {
      const sizeKey = parts[2]; // size11, size12 등
      const property = parts[3]; // fontsize, lineheight, letterspacing

      if (!typographyVariants[sizeKey]) {
        typographyVariants[sizeKey] = {};
      }
      // CSS 변수 참조로 저장
      typographyVariants[sizeKey][property] = key;
    }
    // Font Weight
    else if (category === 'typography' && parts[1] === 'weight') {
      const weightKey = parts[2].replace('weight', '');
      // CSS 변수 참조로 설정
      if (value === 'regular') config.fontWeight[value] = `var(--${key})`;
      else if (value === 'medium') config.fontWeight[value] = `var(--${key})`;
      else if (value === 'semibold') config.fontWeight[value] = `var(--${key})`;
      else if (value === 'bold') config.fontWeight[value] = `var(--${key})`;
    }
    // Scrollarea, Skeleton 등은 colors에 추가
    else if (category === 'scrollarea' || category === 'skeleton') {
      const path = parts; // scrollarea-color-bar -> scrollarea.color.bar
      setNestedValue(config.colors, path, `var(--${key})`);
    }
    // Box Radius (box-radius-*)
    else if (category === 'box' && parts[1] === 'radius') {
      const radiusKey = parts[parts.length - 1].replace('radius', '');
      config.borderRadius[radiusKey] = `var(--${key})`;
    }
  }

  // fontSize 조합 (fontsize, lineheight, letterspacing)
  for (const [sizeKey, props] of Object.entries(typographyVariants)) {
    const size = sizeKey.replace('size', '');
    if (props.fontsize && props.lineheight && props.letterspacing !== undefined) {
      config.fontSize[size] = [
        `var(--${props.fontsize})`,
        {
          lineHeight: `var(--${props.lineheight})`,
          letterSpacing: `var(--${props.letterspacing})`,
        },
      ];
    }
  }

  return config;
}

/**
 * 테마 토큰들을 분석하여 extend 설정 생성
 */
function convertThemeTokens(themes) {
  const extend = {
    colors: {},
    boxShadow: {},
  };

  // 모든 테마의 토큰을 수집하여 공통 구조 생성
  const allTokenKeys = new Set();
  Object.values(themes).forEach(themeTokens => {
    Object.keys(themeTokens).forEach(key => allTokenKeys.add(key));
  });

  // Shadow 조합을 위한 임시 저장소
  const shadowGroups = {};

  for (const tokenKey of allTokenKeys) {
    const parts = tokenKey.split('-');
    const category = parts[0];

    // Shadow 토큰 그룹핑 (x, y, blur, color)
    if (category === 'shadow') {
      const shadowName = parts[1]; // white, gray, button 등
      const property = parts.slice(2).join('-'); // x, y, blur, color

      if (!shadowGroups[shadowName]) {
        shadowGroups[shadowName] = {};
      }
      shadowGroups[shadowName][property] = tokenKey;
    }
    // Tooltip Shadow 별도 처리
    else if (category === 'tooltip' && parts[1] === 'shadow') {
      const shadowName = `tooltip-${parts[2]}-${parts[3]}`; // tooltip-shadow-default, tooltip-shadow-box
      const property = parts.slice(4).join('-'); // x, y, blur, color

      if (!shadowGroups[shadowName]) {
        shadowGroups[shadowName] = {};
      }
      shadowGroups[shadowName][property] = tokenKey;
    }
    // Switch Shadow
    else if (category === 'switch' && parts[1] === 'shadow') {
      const shadowName = `switch-${parts[2]}`; // switch-medium, switch-small
      const property = parts.slice(3).join('-'); // x, y, blur, color

      if (!shadowGroups[shadowName]) {
        shadowGroups[shadowName] = {};
      }
      shadowGroups[shadowName][property] = tokenKey;
    }
    // 기타 색상 토큰들
    else {
      const varRef = `var(--${tokenKey})`;
      const path = parts;
      setNestedValue(extend.colors, path, varRef);
    }
  }

  // boxShadow 조합
  for (const [shadowName, properties] of Object.entries(shadowGroups)) {
    if (properties.x && properties.y && properties.blur && properties.color) {
      extend.boxShadow[shadowName] =
        `var(--${properties.x}) var(--${properties.y}) var(--${properties.blur}) var(--${properties.color})`;
    }
  }

  return extend;
}

/**
 * Tailwind Config 파일 생성
 */
function generateTailwindConfig(primitiveConfig, extendConfig) {
  const configObject = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
      ...primitiveConfig,
      extend: extendConfig,
    },
  };

  // JSON을 JavaScript 코드로 변환
  const configJson = JSON.stringify(configObject, null, 2)
    .replace(/"([^"]+)":/g, (match, key) => {
      // 하이픈이 있거나 음수(숫자로 시작하고 -가 있음)인 경우 따옴표 유지
      if (key.includes('-') || key.startsWith('-')) {
        return `'${key}':`;
      }
      // 일반 키는 따옴표 제거
      return `${key}:`;
    })
    .replace(/: "var\(([^)]+)\)"/g, ": 'var($1)'"); // var() 값은 작은따옴표

  const configContent = `/** @type {import('tailwindcss').Config} */
export default ${configJson};
`;

  return configContent;
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    console.log('🚀 Starting Tailwind config generation...\n');

    // CSS 파일 읽기
    console.log('📖 Reading design-tokens.css...');
    const cssContent = fs.readFileSync(DESIGN_TOKENS_CSS_PATH, 'utf-8');
    console.log('✅ CSS file loaded\n');

    // CSS 변수 파싱
    console.log('🔍 Parsing CSS variables...');
    const { primitive, themes } = parseCssVariables(cssContent);
    console.log(`✅ Parsed ${Object.keys(primitive).length} primitive tokens`);
    console.log(`✅ Parsed ${Object.keys(themes).length} themes\n`);

    // Primitive 토큰 변환
    console.log('🎨 Converting primitive tokens...');
    const primitiveConfig = convertPrimitiveTokens(primitive);
    console.log('✅ Primitive tokens converted\n');

    // Theme 토큰 변환
    console.log('🎨 Converting theme tokens...');
    const extendConfig = convertThemeTokens(themes);
    console.log('✅ Theme tokens converted\n');

    // Tailwind Config 생성
    console.log('📝 Generating tailwind.config.mjs...');
    const configContent = generateTailwindConfig(primitiveConfig, extendConfig);
    fs.writeFileSync(OUTPUT_CONFIG_PATH, configContent, 'utf-8');
    console.log(`✅ Config file generated: ${OUTPUT_CONFIG_PATH}\n`);

    console.log('🎉 Tailwind config generation completed successfully!');
    console.log('\n📝 Usage:');
    console.log('   1. Use theme by setting data-jds-theme attribute:');
    console.log('      <div data-jds-theme="jobkorea">...</div>');
    console.log('      <div data-jds-theme="albamon">...</div>');
    console.log('   2. Use tokens in your Tailwind classes:');
    console.log('      - Colors: text-blue-500, bg-button-primary');
    console.log('      - Spacing: p-16, m-24');
    console.log('      - Shadows: shadow-white, shadow-button');
    console.log('      - Font sizes: text-14, text-20');
  } catch (error) {
    console.error('❌ Error generating Tailwind config:', error);
    process.exit(1);
  }
}

main();
