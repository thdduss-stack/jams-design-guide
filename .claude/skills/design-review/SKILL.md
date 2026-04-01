---
name: design-review
description: |
  Figma 디자인과 실제 구현의 시각적/토큰 레벨 차이를 검수합니다.
  스크린샷 비교 + 디자인 토큰 분석을 조합하여 정확한 검수 리포트를 생성합니다.
trigger: |
  - /design-review [Figma URL] [로컬 페이지 경로] 명령 시
  - 디자인 검수 요청 시
---

# Design Review 스킬

Figma 디자인과 실제 구현 간의 시각적 차이를 검수하고 수정 필요 항목을 리포트합니다.

## 역할

**시각적 비교 + 토큰 레벨 분석**을 통해 디자인 구현의 정확도를 검증합니다.

- Figma 원본 디자인과 로컬 구현의 스크린샷 비교
- 색상, 간격, 폰트, 레이아웃, 아이콘 등 디자인 토큰 레벨 검증
- 수정이 필요한 항목 리스트업 및 구체적인 수정 방안 제시

## 사용법

```bash
# 페이지 전체 검수 (기본)
/design-review https://figma.com/design/xxx?node-id=1-2 /workspace/[id]/jobs

# 특정 컴포넌트 파일 검수
/design-review https://figma.com/design/xxx?node-id=1-2 src/features/jobs/ui/JobCard --scope=component

# 여러 섹션 검수
/design-review https://figma.com/design/xxx?node-id=1-2 /workspace/[id]/jobs --sections="Header,JobList,Footer"
```

### 검수 범위 옵션

| 옵션                   | 설명                           | 사용 시점                   |
| ---------------------- | ------------------------------ | --------------------------- |
| **페이지 전체** (기본) | Figma 노드 전체 vs 로컬 페이지 | 신규 페이지 검수, 전체 리뷰 |
| `--scope=component`    | 개별 컴포넌트 파일 검수        | 재사용 컴포넌트 검증        |
| `--sections="A,B,C"`   | 특정 섹션만 지정하여 검수      | 부분 수정 후 확인           |

## 워크플로우

```
1. URL 파싱
   ├── Figma URL에서 fileKey, nodeId 추출
   └── 로컬 경로 확인 (페이지 or 컴포넌트)

2. 스크린샷 수집 (병렬)
   ├── mcp__figma__get_screenshot (Figma 디자인)
   └── mcp__playwright__browser_take_screenshot (로컬 페이지)

3. 시각적 1차 분석
   └── 두 이미지 비교하여 육안 차이점 리스트업

4. 토큰 2차 분석
   ├── mcp__figma__get_design_context로 Figma 스펙 추출
   └── 실제 코드의 Tailwind 클래스와 비교

5. 리포트 생성
   └── references/report-template.md 형식으로 출력
```

## 상세 실행 순서

### 0. URL 파싱 및 검증

```typescript
// Figma URL 파싱
const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
// "8719-318931" → "8719:318931" 변환

// 로컬 경로 검증
const localPath = validateLocalPath(inputPath);
// 페이지 경로: "/workspace/[id]/jobs" → 브라우저로 접근
// 컴포넌트 경로: "src/features/jobs/ui/JobCard" → 개발 서버에서 렌더링
```

### 1. 스크린샷 수집 (병렬 실행)

```typescript
// 병렬로 두 스크린샷 수집
const [figmaScreenshot, localScreenshot] = await Promise.all([
  // Figma 스크린샷
  mcp__figma__get_screenshot({
    fileKey,
    nodeId,
    clientLanguages: 'typescript,html,css',
    clientFrameworks: 'react,next.js',
  }),

  // 로컬 페이지 스크린샷 (Playwright)
  captureLocalScreenshot(localPath),
]);
```

**로컬 스크린샷 캡처 프로세스:**

```typescript
async function captureLocalScreenshot(localPath: string) {
  // 1. 브라우저 네비게이션 (개발 서버 URL)
  await mcp__playwright__browser_navigate({
    url: `https://hiringcenter.local.jobkorea.co.kr:3000${localPath}`,
  });

  // 2. 페이지 로드 대기
  await mcp__playwright__browser_wait_for({
    time: 2, // 2초 대기
  });

  // 3. 스크린샷 촬영
  const screenshot = await mcp__playwright__browser_take_screenshot({
    type: 'png',
    fullPage: true,
    filename: `local-${Date.now()}.png`,
  });

  return screenshot;
}
```

### 2. 시각적 1차 분석

두 스크린샷을 나란히 비교하여 육안으로 확인 가능한 차이점을 리스트업합니다.

**비교 항목:**

- 전체 레이아웃 구조
- 색상 차이 (배경, 텍스트, 버튼 등)
- 간격 차이 (패딩, 마진, 갭)
- 폰트 차이 (크기, 굵기, 줄높이)
- 아이콘 차이 (종류, 크기, 색상)
- 정렬 차이 (수평, 수직)

### 3. 토큰 2차 분석

시각적 차이가 발견된 항목에 대해 토큰 레벨에서 정확한 값을 비교합니다.

```typescript
// Figma 디자인 컨텍스트 추출
const designContext = await mcp__figma__get_design_context({
  fileKey,
  nodeId,
  clientLanguages: 'typescript',
  clientFrameworks: 'react,next.js',
});

// 변수 정의 추출 (디자인 토큰)
const variableDefs = await mcp__figma__get_variable_defs({
  fileKey,
  nodeId,
});

// 실제 코드의 Tailwind 클래스 분석
// - 해당 컴포넌트 파일 읽기
// - className 추출 및 분석
// - tailwind.config.mjs와 매핑
```

### 4. 리포트 생성

검수 결과를 구조화된 리포트로 출력합니다.

```markdown
# 디자인 검수 리포트

## 검수 대상

- Figma: https://figma.com/design/xxx?node-id=1-2
- 구현: /workspace/[id]/jobs
- 검수 일시: 2026-02-06

## 시각적 차이 (1차 검수)

| 항목        | Figma     | 구현      | 심각도  |
| ----------- | --------- | --------- | ------- |
| 헤더 배경색 | #0057ff   | #0055ff   | 🔴 높음 |
| 버튼 패딩   | 16px 24px | 14px 20px | 🟡 중간 |

## 토큰 레벨 분석 (2차 검수)

| 속성   | Figma 토큰  | 코드 클래스 | 수정 필요      |
| ------ | ----------- | ----------- | -------------- |
| 배경색 | blue-700    | bg-blue-600 | ✅ bg-blue-700 |
| 패딩   | px-24 py-16 | px-20 py-14 | ✅ px-24 py-16 |

## 수정 권장사항

- [ ] Header.tsx:15 - bg-blue-600 → bg-blue-700
- [ ] Button.tsx:23 - px-20 py-14 → px-24 py-16
```

## 검수 항목 상세

### 색상 검수

```typescript
// Figma 색상 추출
const figmaColor = designContext.fills[0].color; // #0057ff

// 코드에서 Tailwind 클래스 추출
const codeClass = extractClassName(componentCode); // "bg-blue-600"

// tailwind.config.mjs에서 실제 값 확인
const actualValue = getTailwindValue('blue-600'); // #0055ff

// 비교 결과
if (figmaColor !== actualValue) {
  addIssue({
    type: 'color',
    figmaValue: figmaColor,
    codeValue: actualValue,
    codeClass: 'bg-blue-600',
    suggestion: 'bg-blue-700', // 정확한 매칭 클래스
  });
}
```

### 간격 검수

```typescript
// Figma 간격 추출
const figmaSpacing = {
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 16,
  paddingBottom: 16,
  gap: 8,
};

// 코드 Tailwind 클래스 분석
const codeSpacing = parseTailwindSpacing('px-20 py-14 gap-6');
// { paddingX: 20, paddingY: 14, gap: 6 }

// 차이 비교
compareSpacing(figmaSpacing, codeSpacing);
```

### 폰트 검수

```typescript
// Figma 폰트 추출
const figmaFont = {
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 24,
  letterSpacing: -0.3,
};

// 코드 Tailwind 클래스 분석
const codeFont = parseTailwindFont('text-16 font-semibold leading-24');

// 차이 비교
compareFont(figmaFont, codeFont);
```

### 레이아웃 검수

```typescript
// Figma 레이아웃 추출
const figmaLayout = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
};

// 코드 Tailwind 클래스 분석
const codeLayout = parseTailwindLayout('flex flex-col items-center justify-between gap-12');

// 차이 비교
compareLayout(figmaLayout, codeLayout);
```

### 아이콘 검수

```typescript
// Figma 아이콘 노드 추출
const figmaIcon = {
  name: 'ic_24_search',
  size: { width: 24, height: 24 },
  color: '#666666',
};

// 코드에서 아이콘 컴포넌트 확인
const codeIcon = extractIconComponent(componentCode);
// <Icon name="search" size={24} color="gray-500" />

// 아이콘 매핑 검증
validateIconMapping(figmaIcon, codeIcon);
```

## 심각도 분류

| 심각도 | 기호 | 설명               | 예시                         |
| ------ | ---- | ------------------ | ---------------------------- |
| 높음   | 🔴   | 브랜드/UX에 영향   | 주요 색상, 레이아웃 깨짐     |
| 중간   | 🟡   | 시각적으로 눈에 띔 | 간격 차이, 폰트 굵기         |
| 낮음   | 🟢   | 미세한 차이        | 1-2px 차이, 미세한 색상 차이 |

## 참조 문서

- [리포트 템플릿](references/report-template.md)
- [검수 체크리스트](references/checklist.md)

## 관련 스킬

- [figma-to-component](../figma-to-component/SKILL.md): Figma → React 컴포넌트 생성
- [vanilla-to-tailwind](../vanilla-to-tailwind/SKILL.md): Vanilla Extract → Tailwind 변환
- [jds-to-tailwind](../jds-to-tailwind/SKILL.md): JDS 레이아웃 → Tailwind 변환

## 제한사항

- 동적 콘텐츠(애니메이션, 호버 상태 등)는 스크린샷 비교에 한계가 있음
- 반응형 디자인은 각 브레이크포인트별로 별도 검수 필요
- 개발 서버가 실행 중이어야 로컬 스크린샷 캡처 가능
