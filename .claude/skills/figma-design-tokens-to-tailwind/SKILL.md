---
name: figma-design-tokens-to-tailwind
description: Figma 디자인 토큰을 Tailwind Config로 자동 변환 (Mode별 브랜드 테마 지원)
---

# Figma Design Tokens to Tailwind 스킬

당신은 Figma의 디자인 토큰(Variables)을 Tailwind CSS 설정 파일로 변환하는 전문가입니다.

## 역할

Figma MCP와 JSON 파일을 활용하여 디자인 토큰을 추출하고 `tailwind.config.mjs`의 theme 객체로 자동 변환합니다.

**데이터 출처:**

- **Typography**: Figma MCP (Local Styles) - fontSize 배열 형식 (lineHeight, letterSpacing 포함)
- **Colors**: figma.variables.json (Primitive + Component 브랜드별)
- **Spacing**: figma.variables.json
- **Border Radius**: figma.variables.json
- **Font Weight**: figma.variables.json

**기본 Figma URL:**

- `https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411`
- 사용자가 URL을 입력하지 않으면 자동으로 사용

## 워크플로우

### 1단계: 사용자 입력 수집 및 상황 파악

다음 정보를 확인합니다:

```
다음 정보를 확인해주세요:

1. Figma Local Styles URL (선택사항)
   - Typography Styles를 가져올 Figma URL
   - 예: https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411
   - 미입력 시 기본값: https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411

2. JSON 파일 경로 (필수)
   - 디자인 토큰 JSON 파일 (figma.variables.json)
   - 기본 경로: 프로젝트 루트
```

**처리 흐름:**

1. JSON 파일 읽기 (primitive, component)
2. Figma MCP로 Local Styles 가져오기 (Typography)
3. JSON + Local Styles 조합하여 Tailwind Config 생성

**상황별 처리:**

- **JSON + Local Styles**: → 2A단계 (권장)
- **JSON만**: → 2B단계 (Typography는 JSON의 variant 사용)

### 2A단계: Figma MCP로 Local Styles 가져오기

#### A. URL 파싱 및 기본값 설정

```javascript
// 사용자 입력 확인
const figmaUrl =
  userInput.figmaUrl || 'https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411';

// URL에서 노드 ID 추출
const nodeId = parseNodeId(figmaUrl); // "3159-36411" → "3159:36411"
```

#### B. Figma MCP로 Local Styles 호출

Typography Local Styles를 가져오기:

```typescript
user -
  Figma_Dev_Mode_MCP -
  get_design_context({
    nodeId: '3159:36411',
    clientLanguages: 'typescript,javascript',
    clientFrameworks: 'react,nextjs',
  });
```

**대체 방법 (design_context 실패 시):**

```typescript
// Variable definitions로 대체
user -
  Figma_Dev_Mode_MCP -
  get_variable_defs({
    nodeId: '3159:36411',
    clientLanguages: 'typescript,javascript',
    clientFrameworks: 'react,nextjs',
  });
```

#### C. Local Styles 파싱

Figma Local Styles에서 Typography 정보 추출:

**예상 응답 (Text Styles):**

```json
{
  "Text Styles": {
    "Body/14 Regular": {
      "fontSize": 14,
      "lineHeight": 22,
      "letterSpacing": 0,
      "fontWeight": 400,
      "fontFamily": "Pretendard"
    },
    "Body/16 Regular": {
      "fontSize": 16,
      "lineHeight": 24,
      "letterSpacing": 0,
      "fontWeight": 400,
      "fontFamily": "Pretendard"
    },
    "Heading/36 Bold": {
      "fontSize": 36,
      "lineHeight": 50,
      "letterSpacing": -0.5,
      "fontWeight": 700,
      "fontFamily": "Pretendard"
    }
  }
}
```

#### D. Typography 변환

Local Styles → Tailwind fontSize 배열:

```javascript
const fontSize = {};

for (const [styleName, style] of Object.entries(textStyles)) {
  const size = style.fontSize;

  fontSize[size] = [
    `${style.fontSize}px`,
    {
      lineHeight: `${style.lineHeight}px`,
      letterSpacing: style.letterSpacing === 0 ? "0" : `${style.letterSpacing}px`
    }
  ];
}

// 결과:
fontSize: {
  14: ["14px", { lineHeight: "22px", letterSpacing: "0" }],
  16: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
  36: ["36px", { lineHeight: "50px", letterSpacing: "-0.5px" }]
}
```

### 2B단계: JSON 파일로 디자인 토큰 가져오기

#### A. JSON 파일 읽기

```typescript
// 프로젝트 루트의 figma.variables.json 확인
const json = Read('figma.variables.json');
```

#### B. JSON 구조 확인

Figma Variables를 내보낸 JSON 파일 구조:

```json
{
  "primitive": {
    "paletteGrayGray900": "#222222",
    "paletteBlueBlue700": "#0057ff",
    "spaceSpaceSpace16": 16,
    "typographyVariantSize14Fontsize": 14,
    "typographyVariantSize14Lineheight": 22,
    "typographyVariantSize14Letterspacing": 0
  },
  "component": {
    "jobkorea": {
      "buttonColorPrimary": "VariableID:11:103",
      "shadowWhiteColor": "#00000019"
    },
    "albamon": {
      "buttonColorPrimary": "VariableID:11:91",
      "shadowWhiteColor": "#00000019"
    }
  }
}
```

#### C. Primitive Typography Variant 파싱

**1. Typography Variant 그룹화**

```javascript
const typographyVariants = {};

for (const [key, value] of Object.entries(json.primitive)) {
  // typographyVariantSize14Fontsize 패턴 인식
  const match = key.match(/typographyVariantSize(\d+)(\w+)/);

  if (match) {
    const [_, size, property] = match;
    if (!typographyVariants[size]) {
      typographyVariants[size] = {};
    }
    typographyVariants[size][property.toLowerCase()] = value;
  }
}

// 결과:
{
  "14": {
    "fontsize": 14,
    "lineheight": 22,
    "letterspacing": 0
  },
  "16": {
    "fontsize": 16,
    "lineheight": 24,
    "letterspacing": 0
  }
}
```

**2. Tailwind fontSize 배열로 변환**

```javascript
const fontSize = {};

for (const [size, props] of Object.entries(typographyVariants)) {
  fontSize[size] = [
    `${props.fontsize}px`,
    {
      lineHeight: `${props.lineheight}px`,
      letterSpacing: props.letterspacing === 0 ? "0" : `${props.letterspacing}px`
    }
  ];
}

// 결과:
fontSize: {
  14: ["14px", { lineHeight: "22px", letterSpacing: "0" }],
  16: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
  36: ["36px", { lineHeight: "50px", letterSpacing: "-0.5px" }]
}
```

#### D. 기타 Primitive 파싱

**색상 추출:**

```javascript
for (const [key, value] of Object.entries(primitive)) {
  if (typeof value === 'string' && value.startsWith('#')) {
    // paletteGrayGray900 → colors.gray[900]
  }
}
```

**Spacing 추출:**

```javascript
if (key.startsWith('spaceSpace')) {
  // spaceSpaceSpace16 → spacing['16'] = '16px'
  // ⚠️ 중요: spacing 값은 padding, margin, gap 등 모든 여백에 공통으로 사용됨
  // padding, margin, gap을 개별 설정하지 않음
}
```

**Border Radius 추출:**

```javascript
if (key.startsWith('radiusRadius')) {
  // radiusRadiusRadius8 → borderRadius['8'] = '8px'
}
```

#### E. Component 파싱

```javascript
for (const [brand, variables] of Object.entries(json.component)) {
  for (const [key, value] of Object.entries(variables)) {
    // VariableID 참조만 제외, 모든 직접 값(string, number) 추출
    if (typeof value === 'string' && value.startsWith('VariableID:')) {
      // VariableID 참조는 무시
      continue;
    }

    // 직접 값 추출
    if (typeof value === 'string') {
      // HEX 색상, weight 문자열 등
      // shadowWhiteColor → colors.jk.shadow.white
      // typographyWeightBold → fontWeight.bold (이미 primitive에 있음)
    } else if (typeof value === 'number') {
      // 숫자 값 처리
      if (key.includes('Opacity')) {
        // opacity 값 → opacity.switch-disable-jk: "0.4"
      } else if (key.includes('Height')) {
        // height 값 → height.modal-top-jk: "40px"
      } else if (key.includes('Radius')) {
        // radius 값 → extend.tag-radius-jk: "999px"
      } else if (key.includes('shadow') && (key.includes('X') || key.includes('Y') || key.includes('Blur'))) {
        // shadow 구성 요소 (주석으로 기록, boxShadow 수동 구성 필요)
        // shadowWhiteX: 0, shadowWhiteY: 4, shadowWhiteBlur: 20
        // → "0 4px 20px rgba(0,0,0,0.1)"
      }
    }
  }
}
```

### 3단계: Typography 통합 (Local Styles + JSON)

#### A. 우선순위

1. **Figma Local Styles** (MCP로 가져온 Typography)
   - 가장 정확하고 최신
   - Text Styles 기준

2. **JSON Typography Variant** (fallback)
   - Local Styles를 가져올 수 없을 때
   - `typographyVariantSize*` 파싱

#### B. 통합 로직

```javascript
// 1. Figma Local Styles 시도
let typographyFromFigma = null;
try {
  const figmaData = await getFigmaLocalStyles(nodeId);
  typographyFromFigma = parseTextStyles(figmaData);
} catch (error) {
  console.log('Local Styles 가져오기 실패, JSON 사용');
}

// 2. JSON Typography Variant 파싱
const typographyFromJson = parseTypographyVariants(json.primitive);

// 3. 병합 (Figma 우선)
const fontSize = {
  ...typographyFromJson,
  ...typographyFromFigma,
};
```

#### C. 최종 fontSize 형식

```javascript
fontSize: {
  11: ["11px", { lineHeight: "18px", letterSpacing: "0" }],
  12: ["12px", { lineHeight: "18px", letterSpacing: "0" }],
  13: ["13px", { lineHeight: "20px", letterSpacing: "0" }],
  14: ["14px", { lineHeight: "22px", letterSpacing: "0" }],
  15: ["15px", { lineHeight: "22px", letterSpacing: "0" }],
  16: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
  18: ["18px", { lineHeight: "26px", letterSpacing: "0" }],
  20: ["20px", { lineHeight: "28px", letterSpacing: "-0.5px" }],
  24: ["24px", { lineHeight: "32px", letterSpacing: "-0.5px" }],
  28: ["28px", { lineHeight: "38px", letterSpacing: "-0.5px" }],
  32: ["32px", { lineHeight: "44px", letterSpacing: "-0.5px" }],
  36: ["36px", { lineHeight: "50px", letterSpacing: "-0.5px" }],
}
```

**사용 예시:**

```jsx
// text-14 클래스 하나로 font-size, line-height, letter-spacing 모두 적용
<p className="text-14">
  텍스트 (14px / 22px / 0)
</p>

<h1 className="text-36 font-bold">
  제목 (36px / 50px / -0.5px)
</h1>
```

### 4단계: 디자인 토큰 분류 및 변환

#### A. 색상 변환 규칙

**Primitive 색상 (단일 Mode):**

```javascript
// 입력: paletteGrayGray900 = "#222222"
// 출력:
colors: {
  gray: {
    900: '#222222'
  }
}
```

**Component 색상 (Multi Mode - JobKorea):**

```javascript
// 입력: component.jobkorea.buttonColorPrimary = "#003cff"
// 출력:
colors: {
  jk: {
    button: {
      primary: '#003cff';
    }
  }
}
```

**Component 색상 (Multi Mode - Albamon):**

```javascript
// 입력: component.albamon.buttonColorPrimary = "#ff501b"
// 출력:
colors: {
  alba: {
    button: {
      primary: '#ff501b';
    }
  }
}
```

#### B. 네이밍 변환 규칙

**camelCase → kebab-case + 중첩 구조:**

```
buttonColorPrimary → button.primary
iconColorSecondary → icon.secondary
boxFillGray100 → box.fill-gray100
chipPrimaryColorAccent → chip.primary-color-accent
```

**패턴 인식:**

- `Color` 앞부분이 카테고리
- `Color` 뒷부분이 속성
- 숫자는 그대로 유지
- 대문자 위치에서 분리

#### C. 색상 그룹 구조

**Primitive 색상:**

- base (black, white, dimed)
- gray (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 930, 950)
- orange, blue, bluegray, red, green, yellow
- violet, purple, pink, indigo, brown, olive, mint
- transparent (8, 12, 16, 20, 24, 32)
- subway (지하철 노선 색상)

**Component 색상 (브랜드별):**

- button (primary, secondary, pressed, accent, hover 등)
- line (primary, secondary)
- typography (primary, secondary1-4, accent-pressed)
- icon (primary, secondary, accent, white, 등)
- box (fill-_, line-_)
- shadow (white, gray, dropdown, button 등)
- switch, checkbox, radio, bullet, tooltip, tabs, chip
- newdot, bottomsheet, datepicker, slider, tag
- separator, form, filllinebutton

### 5단계: Tailwind Config 생성

#### A. 기본 구조

**중요: @jds/theme 의존성 없이 순수 JSON + Figma MCP 데이터만 사용**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  theme: {
    extend: {
      // ===== 데이터 출처 명시 =====
      // primitive (모든 직접 값), component (VariableID 제외한 모든 직접 값)
      // 총 토큰 수: 431개 (Primitive 247개 + Component 184개)

      // ===== Primitive Colors (156개) =====
      colors: {
        gray: { ... },
        blue: { ... },
        // ... 기타 primitive 색상
      },

      // ===== Component Colors (브랜드별 - HEX 색상 110개씩) =====
      // JobKorea 브랜드
      jk: {
        button: { ... },
        icon: { ... },
        shadow: { ... }, // HEX 색상만
        // ...
      },

      // Albamon 브랜드
      alba: {
        button: { ... },
        icon: { ... },
        shadow: { ... }, // HEX 색상만
        // ...
      },

      // ===== Spacing (24개 - JSON의 space 값으로만 설정) =====
      // ⚠️ 중요: padding, margin, gap은 spacing 값을 공통으로 사용
      spacing: {
        0: '0px',
        2: '2px',
        4: '4px',
        // ... 24개
      },

      // ===== Border Radius (10개) =====
      borderRadius: { ... },

      // ===== Typography (12개 sizes) =====
      // fontSize 배열 형식: [size, { lineHeight, letterSpacing }]
      fontSize: {
        14: ["14px", { lineHeight: "22px", letterSpacing: "0" }],
        16: ["16px", { lineHeight: "24px", letterSpacing: "0" }],
        // ...
      },

      // ===== Font Weight (4개) =====
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },

      // ===== Border Width (2개) =====
      borderWidth: {
        1: "1px",
        2: "2px",
      },

      // ===== Component 숫자 값 (72개) =====

      // Opacity (2개)
      opacity: {
        "switch-disable-jk": "0.4", // JobKorea: 40 → 0.4
        "switch-disable-alba": "1", // Albamon: 100 → 1
      },

      // Height (2개)
      height: {
        "modal-top-jk": "40px", // JobKorea
        "modal-top-alba": "48px", // Albamon
      },

      // Box Shadow (22개 - Shadow 구성 요소 조합)
      // ⚠️ Shadow X/Y/Blur/Color를 조합하여 boxShadow 생성
      boxShadow: {
        // JobKorea Shadows (11개)
        "white-jk": "0 4px 20px rgba(0, 0, 0, 0.1)",
        "gray-jk": "0 4px 20px rgba(0, 0, 0, 0.06)",
        "smallbox-jk": "0 4px 12px rgba(0, 0, 0, 0.06)",
        "dropdown-jk": "0 3px 8px rgba(0, 0, 0, 0.1)",
        "button-jk": "0 2px 8px rgba(0, 60, 255, 0.24)",
        "large-jk": "0 8px 16px rgba(34, 34, 34, 0.08)",
        "list-jk": "0 4px 8px rgba(0, 0, 0, 0.02)",
        "switch-medium-jk": "0 1px 4px rgba(0, 0, 0, 0.2)",
        "switch-small-jk": "0 1px 2px rgba(0, 0, 0, 0.2)",
        "tooltip-default-jk": "2px 4px 4px rgba(0, 0, 0, 0.08)",
        "tooltip-box-jk": "0 3px 8px rgba(0, 0, 0, 0.1)",

        // Albamon Shadows (11개)
        "white-alba": "0 1px 8px rgba(0, 0, 0, 0.1)",
        // ... 나머지 albamon shadow
      },

      // ===== Component 특수 케이스 =====
      // Tag Radius는 브랜드별로 다름
      extend: {
        "tag-radius-jk": "999px", // JobKorea
        "tag-radius-alba": "4px", // Albamon
      },
    }
  },

  plugins: [],
};
```

#### B. 브랜드 접두사 규칙

- **JobKorea**: `jk-*`
- **Albamon**: `alba-*`

예시:

```javascript
colors: {
  jk: {
    button: {
      primary: '#003cff',
      secondary: '#5288ff'
    }
  },
  alba: {
    button: {
      primary: '#ff501b',
      secondary: '#ff9457'
    }
  }
}
```

#### C. Component 숫자 값 처리

**1. Opacity 변환**

```javascript
// JSON: switchDisableOpacity: 40
// Tailwind: opacity: { "switch-disable-jk": "0.4" }
// 100 기준 → 0~1 범위로 변환 (40 / 100 = 0.4)
```

**2. Height 변환**

```javascript
// JSON: modalHeightTop: 40
// Tailwind: height: { "modal-top-jk": "40px" }
// 숫자 → px 단위 추가
```

**3. Shadow 구성 요소 → boxShadow 조합**

Shadow는 X, Y, Blur, Color 4개의 값을 조합하여 boxShadow로 생성:

```javascript
// JSON 원본 데이터 (JobKorea White Shadow):
// shadowWhiteX: 0
// shadowWhiteY: 4
// shadowWhiteBlur: 20
// shadowWhiteColor: "#00000019" (rgba(0,0,0,0.1))

// Tailwind boxShadow 조합:
boxShadow: {
  "white-jk": "0 4px 20px rgba(0, 0, 0, 0.1)"
  // 형식: "{X}px {Y}px {Blur}px {Color}"
}
```

**HEX → RGBA 변환:**

```javascript
// #00000019 → rgba(0, 0, 0, 0.1)
// 마지막 2자리(19)가 투명도: 0x19 = 25 (10진수)
// 25 / 255 ≈ 0.098 → 0.1

function hexToRgba(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = parseInt(hex.slice(7, 9), 16) / 255;

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
```

**Shadow 그룹별 조합:**

```javascript
// 각 브랜드마다 11개의 boxShadow 생성
const shadowGroups = [
  'white',
  'gray',
  'smallbox',
  'dropdown',
  'button',
  'large',
  'list',
  'switch-medium',
  'switch-small',
  'tooltip-default',
  'tooltip-box',
];

for (const group of shadowGroups) {
  const x = json.component.jobkorea[`shadow${capitalize(group)}X`];
  const y = json.component.jobkorea[`shadow${capitalize(group)}Y`];
  const blur = json.component.jobkorea[`shadow${capitalize(group)}Blur`];
  const color = json.component.jobkorea[`shadow${capitalize(group)}Color`];

  boxShadow[`${group}-jk`] = `${x}px ${y}px ${blur}px ${hexToRgba(color)}`;
}
```

**4. Tag Radius (특수 케이스)**

```javascript
// JSON: tagRadiusPrimary: 999 (JobKorea), 4 (Albamon)
// Tailwind: extend: { "tag-radius-jk": "999px", "tag-radius-alba": "4px" }
// borderRadius가 아닌 커스텀 속성으로 관리 (브랜드별로 다름)
```

### 6단계: 코드 표시 및 승인

생성된 설정을 사용자에게 표시:

```
✅ Figma 디자인 토큰 변환 완료!

추출된 토큰 요약:
- Primitive: 247개 (색상 156개, Spacing 24개, Typography 12개 등)
- Component - JobKorea: 92개 직접 값
  - HEX 색상 + 문자열: 110개
  - 숫자 값: 36개 (opacity 1개, height 1개, shadow 33개, radius 1개)
- Component - Albamon: 92개 직접 값 (동일 구조)
- boxShadow: 22개 (Shadow 구성 요소 조합)
- 총 토큰: 431개

생성된 Tailwind 설정:

\`\`\`javascript
// tailwind.config.mjs
[생성된 전체 코드 + Shadow 원본 데이터 주석]
\`\`\`

이 설정을 `tailwind.config.mjs`에 적용할까요?
```

### 7단계: 파일 업데이트

사용자 승인 후:

1. 기존 `tailwind.config.mjs` 백업 고려
2. Write tool로 파일 완전 교체
3. Shadow 원본 데이터 주석 추가
4. 완료 메시지 출력

```
✅ tailwind.config.mjs 파일이 업데이트되었습니다!

적용된 내용:
- Primitive: 247개 (100% 추출)
- Component: 184개 (VariableID 제외한 모든 직접 값)
- boxShadow: 22개 (Shadow 구성 요소 조합)
- 총 토큰: 431개

파일 하단에 Shadow 원본 데이터가 주석으로 추가되었습니다.
```

## 실제 적용 예시 (JAMS-Core)

### JSON 입력 구조 (최신 - mode1 없음)

```json
{
  "primitive": {
    "paletteGrayGray900": "#222222",
    "paletteBlueBlue700": "#0057ff",
    "paletteOrangeOrange500": "#ff501b",
    "spaceSpaceSpace16": 16,
    "radiusRadiusRadius8": 8
  },
  "component": {
    "jobkorea": {
      "buttonColorPrimary": "VariableID:11:103",
      "shadowWhiteColor": "#00000019",
      "selectboxHoverFocus": "#f0f5ff7f"
    },
    "albamon": {
      "buttonColorPrimary": "VariableID:11:91",
      "shadowWhiteColor": "#00000019",
      "selectboxHoverFocus": "#fff8f67f"
    }
  }
}
```

**처리 결과:**

- Primitive: 모든 값 추출 ✅
- Component: 모든 직접 값(string, number) 추출 (`shadowWhiteColor`, `selectboxHoverFocus`, `typographyWeightBold`, `shadowWhiteX` 등)
- VariableID 참조: 무시 (실제 값이 아닌 참조이므로) ⚠️

### 생성된 Tailwind Config

```javascript
export default {
  theme: {
    extend: {
      // 총 토큰 수: 431개 (Primitive 247개 + Component 184개)

      colors: {
        // Primitive (156개)
        gray: { 900: '#222222' },
        blue: { 700: '#0057ff' },
        orange: { 500: '#ff501b' },
        // ... 기타 primitive 색상

        // JobKorea (110개 HEX 색상)
        jk: {
          button: { primary: '#003cff' },
          icon: { primary: '#0057ff' },
          typography: { primary: '#0057ff' },
          shadow: { white: '#00000019' }, // HEX 색상만
        },

        // Albamon (110개 HEX 색상)
        alba: {
          button: { primary: '#ff501b' },
          icon: { primary: '#ff501b' },
          typography: { primary: '#ff501b' },
          shadow: { white: '#00000019' }, // HEX 색상만
        },
      },

      // Spacing (24개)
      spacing: { 0: '0px', 2: '2px', 4: '4px' /* ... */ },

      // Typography (12개)
      fontSize: {
        14: ['14px', { lineHeight: '22px', letterSpacing: '0' }],
        16: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
      },

      // Font Weight (4개)
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // Component 숫자 값 (72개)

      // Opacity (2개)
      opacity: {
        'switch-disable-jk': '0.4',
        'switch-disable-alba': '1',
      },

      // Height (2개)
      height: {
        'modal-top-jk': '40px',
        'modal-top-alba': '48px',
      },

      // Box Shadow (22개 - Shadow 구성 요소 조합)
      boxShadow: {
        'white-jk': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'button-jk': '0 2px 8px rgba(0, 60, 255, 0.24)',
        'white-alba': '0 1px 8px rgba(0, 0, 0, 0.1)',
        'button-alba': '0 2px 8px rgba(255, 80, 27, 0.24)',
        // ... 총 22개
      },

      // Tag Radius (특수 케이스)
      extend: {
        'tag-radius-jk': '999px',
        'tag-radius-alba': '4px',
      },
    },
  },

  plugins: [],
};

/*
 * Shadow 원본 데이터 (참고용):
 * JobKorea:
 * - shadowWhiteX: 0, shadowWhiteY: 4, shadowWhiteBlur: 20, shadowWhiteColor: #00000019
 * - shadowButtonX: 0, shadowButtonY: 2, shadowButtonBlur: 8, shadowButtonColor: #003cff3d
 *
 * Albamon: (동일 구조, 다른 값)
 * - shadowWhiteX: 0, shadowWhiteY: 1, shadowWhiteBlur: 8, shadowWhiteColor: #00000019
 * - shadowButtonX: 0, shadowButtonY: 2, shadowButtonBlur: 8, shadowButtonColor: #ff501b3d
 */
```

### 사용 예시

```jsx
// JobKorea 스타일
<div className="bg-jk-button-primary hover:bg-jk-button-primary-hover shadow-button-jk">
  <span className="text-jk-typography-primary">JobKorea Button</span>
  <svg className="text-jk-icon-primary">아이콘</svg>
</div>

// Albamon 스타일
<div className="bg-alba-button-primary hover:bg-alba-button-primary-hover shadow-button-alba">
  <span className="text-alba-typography-primary">Albamon Button</span>
  <svg className="text-alba-icon-primary">아이콘</svg>
</div>

// Primitive 색상
<div className="bg-gray-900 text-white border border-blue-700">
  공통 색상
</div>

// Spacing 사용 (padding, margin, gap 모두 동일한 spacing 값 사용)
<div className="p-16 m-8 gap-12">
  {/* p-16 = padding: 16px */}
  {/* m-8 = margin: 8px */}
  {/* gap-12 = gap: 12px */}
</div>

// Typography (fontSize 배열)
<p className="text-14">{/* 14px / 22px / 0 */}</p>
<h1 className="text-36 font-bold">{/* 36px / 50px / -0.5px */}</h1>

// Box Shadow 사용
<div className="shadow-white-jk">White Shadow</div>
<div className="shadow-dropdown-jk">Dropdown Shadow</div>
<div className="shadow-large-jk">Large Shadow</div>

// Component 숫자 값 사용
<div className="opacity-switch-disable-jk">Disabled Switch (40%)</div>
<div className="h-modal-top-jk">Modal Top (40px)</div>

// Tag Radius (브랜드별)
<span className="rounded-[--tag-radius-jk]">JobKorea Tag</span>
<span className="rounded-[--tag-radius-alba]">Albamon Tag</span>
```

## 변환 패턴 상세

### 1. Button 색상

```
Input:  buttonColorPrimary
Output: button.primary

Input:  buttonColorSecondaryhover
Output: button.secondary-hover

Input:  buttonColorAccentpressed
Output: button.accent-pressed
```

### 2. Icon 색상

```
Input:  iconColorPrimary
Output: icon.primary

Input:  iconColorSecondary2
Output: icon.secondary2

Input:  iconColorWhite
Output: icon.white
```

### 3. Box 색상

```
Input:  boxFillGray100
Output: box.fill-gray100

Input:  boxLineGray200
Output: box.line-gray200

Input:  boxFillLightsecondary
Output: box.fill-light-secondary
```

### 4. Chip 색상 (복잡한 케이스)

```
Input:  chipsecondaryLineLightprimary
Output: chip.secondary-line-light-primary

Input:  chipprimaryColorSecondarysmall1
Output: chip.primary-color-secondary-small1
```

## 중요 규칙

1. **순수 데이터 사용**: @jds/theme 등 외부 의존성 없이 figma.variables.json + Figma MCP 사용
2. **Figma MCP로 Typography 가져오기**: Local Styles에서 Typography 정보 추출
3. **기본 URL 사용**: URL 미입력 시 `https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411` 사용
4. **fontSize 배열 형식**: lineHeight, letterSpacing을 포함한 배열로 구성
5. **JSON 파일 필수**: figma.variables.json에서 색상, spacing, radius 추출
6. **extend 사용**: theme.extend에 추가하여 기본 Tailwind 테마 유지
7. **브랜드 접두사**: jk, alba 등 명확한 브랜드 식별자 사용
8. **주석 추가**: 각 섹션에 데이터 출처 명시
9. **통합 우선순위**: Figma MCP (Typography) > JSON (색상, spacing 등)
10. **Spacing 단일 설정**: padding, margin, gap 등 모든 여백은 spacing 값으로만 설정하며, 개별 설정하지 않음
11. **Component 데이터 완전 추출**: VariableID 참조를 제외한 모든 직접 값(HEX 색상, 문자열, 숫자) 추출하여 누락 없이 변환
12. **Shadow 조합**: Shadow X/Y/Blur/Color 구성 요소를 boxShadow로 조합하여 실제 사용 가능한 형태로 제공
13. **Shadow 원본 데이터 주석**: 파일 하단에 Shadow 구성 요소 원본 데이터를 주석으로 추가하여 참고 가능하도록 함

## 제한사항

### ⚠️ 1. Figma Variables Mode 미지원

Figma MCP의 `get_variable_defs`는 **기본 Mode의 값만 추출**합니다.

- ❌ Mode별 변수 불가: JobKorea, Albamon, Light/Dark 등의 브랜드/테마별 Mode
- ✅ 기본 Mode만 가능: 첫 번째 Mode의 변수 값만 추출

### ⚠️ 2. VariableID 참조 제한

Component 섹션의 VariableID 참조는 **직접 해결 불가**합니다.

**문제:**

```json
{
  "component": {
    "jobkorea": {
      "buttonColorPrimary": "VariableID:11:103" // ← 참조
    }
  }
}
```

**해결 방법:**

1. **모든 직접 값 추출** (권장)
   - VariableID 참조는 무시
   - 직접 값(string, number) 모두 추출:
     - HEX 색상: `"shadowWhiteColor": "#00000019"`
     - 문자열: `"typographyWeightBold": "bold"`
     - 숫자: `"shadowWhiteX": 0`, `"modalHeightTop": 40`
2. **Figma API 사용** (향후)
   - Figma REST API로 VariableID 매핑 조회
   - 실제 색상 값 해결

**현재 구현:**

- Primitive: 모든 값 사용 (직접 값)
- Component: 모든 직접 값 추출 (HEX, string, number)
- Component: VariableID 참조만 제외

### 해결 방법

**Option 1: JSON 파일 사용 (권장)**

1. Figma에서 Variables를 JSON으로 내보내기
2. `figma.variables.json` 파일 프로젝트 루트에 저장
3. 스킬이 자동으로 파싱하여 Mode별 변수 적용

**Option 2: 수동 구성**

1. 각 Mode별로 수동 입력
2. 브랜드별 테마를 직접 정의

**Option 3: Figma API 직접 호출 (향후)**

1. Figma REST API로 Variables 엔드포인트 호출
2. Mode 정보 포함하여 가져오기

### 현재 지원하지 않는 기능

- 복합 Font 속성 (Font(...) 형식)
- 복합 Effect 속성 (Effect(...) 형식)
- Gradient 변수
- Figma Variables의 Alias 참조 (간접 참조)

## 실행 방법

### 기본 실행 (권장)

```
"Figma 디자인 토큰을 Tailwind로 변환해줘"
```

**자동 처리:**

1. ✅ 기본 Figma URL 사용
   - `https://www.figma.com/design/NiWp4FeJudLewDP3OSa0i4/JAMS-Core?node-id=3159-36411`
2. ✅ figma.variables.json 읽기
3. ✅ Typography variant 조합 (fontSize 배열)
4. ✅ Primitive 색상, spacing, radius 추출
5. ✅ Component 직접 HEX 값 추출
6. ✅ tailwind.config.mjs 생성

### 커스텀 URL 사용

```
"Figma 디자인 토큰을 Tailwind로 변환해줘"

질문: Figma Local Styles URL을 입력해주세요 (Enter로 기본값 사용)
입력: https://www.figma.com/design/YOUR_FILE/...?node-id=123-456
```

**실행 흐름:**

1. 사용자 제공 URL로 Figma MCP 호출
2. figma.variables.json 읽기
3. 데이터 통합 및 Tailwind Config 생성

### JSON만 사용 (빠른 실행)

```
"figma.variables.json만 보고 Tailwind 설정 만들어줘"
```

**실행 흐름:**

1. Figma MCP 건너뛰기
2. JSON의 typography variant만 사용
3. 즉시 Tailwind Config 생성 (< 2초)

## 실행 예시

### 예시 1: 기본 실행

```
User: "Figma 디자인 토큰을 Tailwind로 변환해줘"

Claude:
1. 기본 Figma URL 사용 (JAMS-Core)
2. figma.variables.json 읽기...
3. Typography variant 조합 중...
   - size11: 11px / 18px / 0
   - size14: 14px / 22px / 0
   - size36: 36px / 50px / -0.5px
4. Primitive 색상 추출...
   - gray: 50, 100, 300, 500, 700, 900
   - blue: 50, 700, 800, 900
   - orange: 50, 500, 800
5. Spacing, BorderRadius 추출...

✅ 변환 완료!
- Primitive: 160+ 개
- Typography: 12개 (배열 형식)
- Spacing: 20+ 개
- Border Radius: 10+ 개

tailwind.config.mjs에 적용할까요? (y/n)

User: "적용"

Claude:
✅ tailwind.config.mjs 업데이트 완료!
```

### 예시 2: 커스텀 URL

```
User: "다른 Figma 파일로 디자인 토큰 변환해줘"

Claude: "Figma URL을 입력해주세요 (Enter로 기본값)"

User: "https://www.figma.com/design/xyz123/MyProject?node-id=1-2"

Claude:
1. 커스텀 URL 사용
2. 노드 ID 추출: 1:2
3. Figma MCP 호출...
4. figma.variables.json 읽기...
...
```

## 추가 기능 (향후)

**우선순위 높음:**

- [x] **Typography 배열 형식**: fontSize에 lineHeight, letterSpacing 자동 포함 ✅
- [x] **기본 Figma URL**: URL 미입력 시 JAMS-Core 기본 URL 사용 ✅
- [x] **Component 모든 직접 값 추출**: HEX 색상, 문자열, 숫자 값 모두 추출 ✅
- [x] **boxShadow 자동 생성**: Shadow X/Y/Blur/Color 구성 요소를 조합하여 22개 boxShadow 생성 ✅
- [ ] **VariableID 자동 해결**: Component의 VariableID 참조를 실제 색상으로 변환
- [ ] **Figma Local Styles 활용**: Color Styles, Effect Styles도 추출
- [ ] **Figma API 직접 호출**: Mode 데이터를 포함한 Variables 가져오기

**우선순위 중간:**

- [ ] **CSS Custom Properties 생성**: 런타임 테마 전환을 위한 CSS Variables
- [ ] 변수 변경 감지 및 자동 동기화
- [ ] 디자인 토큰 문서 자동 생성 (Markdown)
- [ ] TypeScript 타입 정의 자동 생성
- [ ] Storybook 연동 (브랜드별 테마 프리뷰)

## 현재 지원 상태

### ✅ 완전 지원

- Primitive 색상
- Primitive Spacing
- Primitive Border Radius
- Primitive Typography (fontSize 배열)
- Primitive Font Weight
- Primitive Border Width
- Component 직접 값 (184개):
  - HEX 색상
  - 문자열 값 (typography weight 등)
  - 숫자 값 (opacity, height, shadow X/Y/Blur, radius)
- **boxShadow**: Shadow 구성 요소를 조합하여 실제 사용 가능한 boxShadow 제공

### ❌ 미지원

- Component VariableID 참조 (실제 값이 아닌 참조)
- Mode별 변수 (Light/Dark, 브랜드별 - Figma MCP 제한)

## 트러블슈팅

### Q: Mode별 변수가 추출되지 않아요

**A:** Figma MCP는 기본 Mode만 지원합니다. `figma.variables.json` 파일을 사용하세요.

```bash
# Figma에서 Variables를 JSON으로 내보내기
# 프로젝트 루트에 저장: figma.variables.json
```

### Q: JSON 파일 구조가 달라요

**A:** JSON 파일 구조를 확인하고 다음 형식인지 체크:

```json
{
  "primitive": { "mode1": { ... } },
  "component": { "brandName": { ... } }
}
```

### Q: 변환된 클래스명이 너무 길어요

**A:** 브랜드 접두사를 단축하거나 Tailwind의 theme 구조를 재조정하세요:

```javascript
// 긴 이름
jk - chip - secondary - line - light - primary;

// 짧게 조정
jk - chip - secondary - primary;
```

### Q: 기존 Tailwind 클래스와 충돌해요

**A:** 브랜드 접두사(jk, alba)를 사용하여 충돌 방지. 필요시 prefix 설정 추가:

```javascript
export default {
  prefix: 'jams-',
  theme: { ... }
}
```
