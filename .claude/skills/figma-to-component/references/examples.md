# Figma to Component 변환 예시

## 기본 컴포넌트 생성 패턴

### 예시 1: 신규 컴포넌트 생성 (props 있음)

```tsx
// src/components/Card/index.tsx
export interface CardProps {
  className?: string;
  title?: string;
  description?: string;
}

const Card = ({ className = '', title, description }: CardProps) => {
  return (
    <div className={`rounded-12 bg-base-white p-16 ${className}`}>
      <div className='flex flex-col gap-12'>
        <span className='text-16 font-semibold text-gray-900'>{title}</span>
        <span className='font-normal text-14 text-gray-600'>{description}</span>
      </div>
    </div>
  );
};

export default Card;
```

### 예시 2: 신규 컴포넌트 생성 (props 없음)

```tsx
// src/components/Divider/index.tsx
const Divider = () => {
  return <div className='h-px w-full bg-gray-200' />;
};

export default Divider;
```

## 컴포넌트 재사용 패턴

### 예시 3: 로컬 컴포넌트 재사용

**시나리오**: Figma에 "ContactInfo" 컴포넌트가 있고, 로컬에 이미 `BZWRegistControl` 컴포넌트가 존재하는 경우

```tsx
// 🔍 Indexer 결과 (repo-component-indexer 호출 결과)
{
  matches: {
    "BZWRegistControl": {
      decision: "use_local",
      importPath: "@/components/BZWRegistControl",
      componentName: "BZWRegistControl",
      exportKind: "default"
    }
  }
}

// ✅ 로컬 컴포넌트 재사용
// src/components/ContactInfo/index.tsx
import React from 'react';
import BZWRegistControl from '@/components/BZWRegistControl'; // ✅ 기존 재사용
import BZWLabel from '@/components/BZWLabel'; // 신규 생성

export interface ContactInfoProps {
  contactName?: string;
}

const ContactInfo = ({ contactName }: ContactInfoProps) => (
  <div className='flex flex-col gap-12'>
    <div className='flex items-center justify-between'>
      <BZWLabel>{contactName}</BZWLabel>
    </div>

    {/* ✅ 기존 BZWRegistControl 컴포넌트 재사용 */}
    <BZWRegistControl />
  </div>
);

export default ContactInfo;
```

### 예시 4: @jds/theme 컴포넌트 재사용

```tsx
// Figma에 Checkbox, TextField 노드가 있을 때
import { Checkbox, TextField } from '@jds/theme';

const FormSection = () => (
  <div className='flex flex-col gap-16'>
    {/* ✅ @jds/theme 컴포넌트 그대로 사용 */}
    <Checkbox>동의합니다</Checkbox>

    <TextField.Root>
      <TextField.Label>이름</TextField.Label>
      <TextField.Input placeholder='이름을 입력하세요' />
    </TextField.Root>
  </div>
);
```

### 예시 5: @jds/theme Button width 처리

```tsx
import { Button } from '@jds/theme';

// ❌ 잘못된 사용 - width 누락
// Figma에서 width: 368px인데 className 없으면 content 크기로 축소됨
const WrongExample = () => <Button>버튼</Button>;

// ✅ 올바른 사용 - 고정 width
const CorrectExample1 = () => <Button className='w-[368px]'>버튼</Button>;

// ✅ 올바른 사용 - 전체 width
const CorrectExample2 = () => <Button className='w-full'>버튼</Button>;
```

## 토큰 매핑 예시

### 예시 6: 색상 매핑 (토큰 이름 우선)

```tsx
// Figma Variable: "jk/button/primary" = #003cff
// ✅ 토큰 이름 매핑 (최우선 - 테마 안전)
<button className='bg-jk-button-primary text-base-white'>
  클릭
</button>

// Figma Variable: "white"
// ⚠️ CRITICAL: base 색상은 반드시 "base-" prefix
<div className='bg-base-white text-base-black'>
  {/* ❌ bg-white, text-black는 인식 불가 */}
</div>
```

### 예시 7: 색상 정확 매칭

```tsx
// Figma: #0057ff (tailwind.config에서 blue-700과 정확히 일치)
// ✅ 정확한 매칭
<div className='bg-blue-700'>콘텐츠</div>

// Figma: #0058ff (tailwind.config에 없음)
// 🎨 arbitrary value 사용 (유사한 값 찾지 않음!)
<div className='bg-[#0058ff]'>콘텐츠</div>
```

### 예시 8: Spacing 매핑

```tsx
// Figma: gap 16px (tailwind.config에 16 정의됨)
// ✅ 정확한 매칭
<div className='flex gap-16'>...</div>

// Figma: gap 17px (tailwind.config에 없음)
// 🎨 arbitrary value 사용
<div className='flex gap-[17px]'>...</div>

// Figma: padding 16px
// ✅ spacing 토큰은 숫자가 그대로 클래스명에 매핑
<div className='p-16'>...</div>
```

### 예시 9: Width/Height 매핑 (⚠️ CRITICAL)

```tsx
// Figma: width 1px (구분선)
// ✅ 반드시 w-px 사용
<div className='w-px h-[60px] bg-gray-200' />

// Figma: width 368px
// ✅ 정확한 값 사용
<div className='w-[368px]'>콘텐츠</div>

// Figma: width 100%
// ✅ Tailwind 클래스 사용
<div className='w-full'>콘텐츠</div>

// Figma: flex 1
// ✅ Flexbox 크기
<div className='flex-1'>콘텐츠</div>
```

### 예시 10: Layout 매핑

```tsx
// Figma Auto Layout:
// - layoutMode: "HORIZONTAL"
// - itemSpacing: 8
// - paddingLeft: 16, paddingTop: 10
// - paddingRight: 16, paddingBottom: 10

// ✅ Tailwind Flexbox 변환
<div className='flex flex-row gap-8 px-16 py-10'>
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Indexer 기반 재사용 예시

### 예시 11: Indexer 호출 및 매칭

```typescript
// 1. Figma 노드에서 이름 추출
const nodeNames = nodes.map(node => node['data-name'] || node.name);
// ['ContactInfo', 'BZWRegistControl', 'BZWLabel', 'CheckboxGroup']

// 2. repo-component-indexer 서브 에이전트 호출
const indexerResult = await callSubAgent('repo-component-indexer', {
  nodeNames,
  targetLayers: ['src/shared/ui', 'src/features/**/ui', 'src/entities/**/ui'],
});

// 3. 매칭 결과
{
  matches: {
    "BZWRegistControl": {
      decision: "use_local",
      importPath: "@shared/ui/BZWRegistControl",
      componentName: "BZWRegistControl",
      exportKind: "default"
    },
    "CheckboxGroup": {
      decision: "use_jds",
      componentName: "Checkbox"
    },
    "BZWLabel": {
      decision: "create_new"
    }
  }
}

// 4. 매칭 결과에 따라 처리
for (const node of nodes) {
  const nodeName = node['data-name'] || node.name;
  const match = indexerResult.matches?.[nodeName];

  if (match?.decision === 'use_local') {
    // ✅ 로컬 컴포넌트 재사용
    addImport(match.importPath, match.componentName);
    continue;
  }

  if (match?.decision === 'use_jds') {
    // ✅ @jds/theme 컴포넌트 사용
    addJdsImport(match.componentName);
    continue;
  }

  // 신규 컴포넌트 생성
  createNewComponent(nodeName, node);
}
```

## 아이콘 처리 예시

### 예시 12: icon-mapper 서브 에이전트 호출

```typescript
// Figma에서 아이콘 노드 발견 시
const iconNode = {
  type: 'COMPONENT',
  name: 'IconCamera',
  'data-name': 'camera-icon'
};

// icon-mapper 서브 에이전트 호출
const iconResult = await callSubAgent('icon-mapper', {
  figmaIconName: 'camera',
  normalizeFrom: 'IconCamera'
});

// 결과:
{
  figmaName: 'IconCamera',
  normalizedName: 'camera',
  projectName: 'system_camera',
  component: 'BZWIcon',
  import: "import BZWIcon from '@shared/ui/BZWIcon';",
  usage: "<BZWIcon name='system_camera' size='24' />",
  confidence: 'exact'
}

// ✅ 컴포넌트에 적용
import BZWIcon from '@shared/ui/BZWIcon';

const CameraButton = () => (
  <button className='flex items-center gap-8'>
    <BZWIcon name='system_camera' size='24' />
    <span>사진 업로드</span>
  </button>
);
```

## 디버깅 예시

### 예시 13: Figma 토큰 없음

```
⚠️ Warning: Figma Variables not found
원인: Figma에서 Variables/Tokens를 사용하지 않음
영향: 색상/spacing이 하드코딩된 값으로 매핑됨 (테마 변경 시 수동 수정 필요)

해결:
1. Figma에서 Variables 사용 권장
2. 또는 tailwind.config.mjs에 모든 값 정의 후 정확 매칭
```

### 예시 14: 토큰 매칭 실패

```
❌ Error: Token "jk/button/special" not found in tailwind.config
원인: Figma 토큰이 tailwind.config.mjs에 정의되지 않음

해결 방법 1: tailwind.config.mjs에 토큰 추가
// tailwind.config.mjs
module.exports = {
  theme: {
    extend: {
      colors: {
        'jk-button-special': '#ff6b00'
      }
    }
  }
}

해결 방법 2: arbitrary value 사용 (임시)
<button className='bg-[#ff6b00]'>버튼</button>
```

### 예시 15: Width 1px 누락 오류

```
❌ Error: 레이아웃 불일치 - 구분선이 보이지 않음
원인: Figma width 1px를 생략하여 구분선이 렌더링되지 않음

잘못된 코드:
<div className='h-[60px] bg-gray-200' /> {/* width 누락 */}

수정된 코드:
<div className='w-px h-[60px] bg-gray-200' /> {/* ✅ w-px 추가 */}
```

### 예시 16: base 색상 prefix 누락

```
❌ Error: Tailwind 빌드 에러 - "text-white" class not found
원인: base 계층 색상에 "base-" prefix를 사용하지 않음

잘못된 코드:
<div className='bg-white text-black'>콘텐츠</div>

수정된 코드:
<div className='bg-base-white text-base-black'>콘텐츠</div>
```

## 전체 워크플로우 예시

### 예시 17: Figma URL부터 컴포넌트 생성까지

```
입력: https://figma.com/design/abc123/MyApp?node-id=1-2

1. URL 파싱 및 데이터 수집
   - fileKey: "abc123"
   - nodeId: "1:2" (8719-318931 → 8719:318931 변환)
   - get_design_context() 호출
   - get_variable_defs() 호출 (필수!)
   - tailwind.config hint 확인

2. Indexer 호출로 재사용 컴포넌트 매칭
   - nodeNames: ["ContactInfo", "BZWRegistControl", "BZWLabel"]
   - repo-component-indexer 호출
   - 매칭 결과 획득

3. 컴포넌트 생성/재사용
   - BZWRegistControl: ✅ 로컬 재사용
   - BZWLabel: 신규 생성
   - ContactInfo: 신규 생성 (BZWRegistControl 포함)

4. 최종 검증 (Figma 재검증)
   - 레이아웃 동일 확인
   - 색상/간격/텍스트 완전 동일 확인
   - Width/Height 1px 포함 모든 값 확인
   - 아이콘 매핑 확인

5. Prettier/Lint 검증
   - pnpm prettier --check src/components/ContactInfo/index.tsx
   - pnpm lint:check -- --file src/components/ContactInfo/index.tsx
```

출력 파일:

```
src/components/
├── ContactInfo/
│   └── index.tsx (신규 생성)
├── BZWLabel/
│   └── index.tsx (신규 생성)
└── BZWRegistControl/
    └── index.tsx (✅ 기존 컴포넌트 재사용됨)
```

## 금지 패턴 예시

### 예시 18: 하지 말아야 할 것

```tsx
// ❌ vanilla-extract 사용 금지
// src/components/Card/index.css.ts (생성 금지!)
import { style } from '@vanilla-extract/css';
export const card = style({
  padding: '16px',
  background: 'white'
});

// ❌ 유사한 값 찾기 금지
// Figma: #0058ff
// 잘못: "blue-700이 비슷하니까 사용" → 금지!
<div className='bg-blue-700'>...</div> // ❌

// ✅ 정확한 값 사용
<div className='bg-[#0058ff]'>...</div> // ✅

// ❌ 로컬 컴포넌트 재생성 금지
// BZWRegistControl이 이미 src/shared/ui에 있는데 새로 만듦
// src/components/RegistControl/index.tsx (생성 금지!)

// ❌ React.FC 패턴 사용 금지
const Card: React.FC<CardProps> = ({ title }) => { // ❌
  return <div>{title}</div>;
};

// ✅ 올바른 패턴
const Card = ({ title }: CardProps) => { // ✅
  return <div>{title}</div>;
};

// ❌ base 색상에 prefix 누락 금지
<div className='bg-white text-black'> // ❌ 인식 불가

// ✅ base 색상은 반드시 prefix
<div className='bg-base-white text-base-black'> // ✅
```

## 체크리스트

변환 작업 완료 전 확인:

1. [ ] Figma URL에서 데이터 수집 완료 (design_context, variable_defs)
2. [ ] Indexer 호출하여 로컬 컴포넌트 매칭 완료
3. [ ] 로컬 컴포넌트 재사용 (직접 스캔/exists 사용 안함)
4. [ ] @jds/theme 컴포넌트 확인 (레이아웃→Tailwind, UI→그대로)
5. [ ] Figma 토큰 이름 우선 매핑 (테마 안전)
6. [ ] base 색상은 "base-" prefix 사용
7. [ ] Width/Height 1px 포함 모든 값 정확히 적용
8. [ ] @jds/theme Button에 className으로 width 전달
9. [ ] 아이콘은 icon-mapper 서브 에이전트로 매핑
10. [ ] vanilla-extract 사용 안함 (Tailwind만 사용)
11. [ ] Prettier/Lint 검증 통과
12. [ ] Figma 재검증: 레이아웃/색상/간격/텍스트 완전 동일
