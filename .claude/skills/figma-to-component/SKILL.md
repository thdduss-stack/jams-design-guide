---
name: figma-to-component
description: |
  Figma 디자인을 React 컴포넌트로 자동 생성 (Tailwind CSS 전용)

  ⚠️ CRITICAL: 이 스킬은 Tailwind CSS만 사용합니다.
  vanilla-extract, CSS-in-JS 사용 금지. 프로젝트 전역 규칙과 충돌 시 이 스킬이 우선.

  📚 관련 스킬:
  - jds-to-tailwind: JDS 레이아웃 컴포넌트 변환
  - vanilla-to-tailwind: Vanilla Extract CSS 변환
trigger: Figma URL 제공 시 자동 실행
---

# Figma to Component 스킬

Figma 디자인을 기반으로 React 컴포넌트를 자동 생성합니다.

## ⚡ 자동 실행

**Figma URL 감지 시 즉시 실행 (질문하지 않음)**

- URL 패턴: `https://figma.com/(design|file)/{fileKey}?node-id={nodeId}`
- 실행 순서: (상세 설명: [execution-order.md](references/execution-order.md)) 0. **URL 파싱 및 기본 검증**
  1. **📊 Figma 데이터 수집** (MCP 호출)
  2. **🏗️ DDP 아키텍처 확인** (필수 - 파일 생성 전)
     - 컴포넌트 유형 결정 (참조: [component-type-decision.md](references/component-type-decision.md))
     - 폴더 구조 확인 요청 → 사용자 승인 대기
  3. **서브 에이전트 호출** (figma-react-ui): 분석/매핑 리포트 생성 (선택)
  4. **컴포넌트 생성/수정** + 로컬 재사용 반영
  5. **진단 이슈 해결**
  6. **Prettier/Lint 검증** (필수)
  7. **최종 검증** (Figma 재검증)
  8. **완료 선언**

## 🏗️ DDP 아키텍처 기반 폴더 구조 확인 (필수)

**⚠️ CRITICAL: 파일 생성 전 반드시 폴더 구조를 확인받아야 합니다.**

### 컴포넌트 배치 위치 결정 프로세스

```
1. Figma 디자인 분석
   ↓
2. 컴포넌트 성격 파악 (Feature UI / Entity UI / Shared UI)
   ↓
3. DDP 구조에 따른 경로 결정
   ↓
4. 사용자에게 폴더 구조 확인 요청
   ↓
5. 확인 후 파일 생성 진행
```

### 컴포넌트 유형별 배치 규칙

| 컴포넌트 유형      | 배치 경로                    | 설명                                 |
| ------------------ | ---------------------------- | ------------------------------------ |
| **Feature UI**     | `src/features/{feature}/ui/` | 특정 기능에 종속된 UI 컴포넌트       |
| **Entity UI**      | `src/entities/{entity}/ui/`  | 비즈니스 엔티티 표현 UI              |
| **Shared UI**      | `src/shared/ui/`             | 범용 재사용 컴포넌트                 |
| **View Component** | `src/views/{domain}/`        | 페이지 레벨 컴포넌트                 |
| **Widget**         | `src/widgets/{domain}/`      | 복합 UI 컴포넌트 (여러 Feature 조합) |

### 폴더 구조 확인 요청 형식 (필수)

파일 생성 전 **반드시** 아래 형식으로 사용자에게 확인:

```markdown
## 📁 폴더 구조 확인

Figma 디자인 분석 결과, 다음 구조로 컴포넌트를 생성하려고 합니다:

### 생성 예정 파일

| 파일 경로                                            | 컴포넌트명    | 유형       |
| ---------------------------------------------------- | ------------- | ---------- |
| `src/features/applicants/ui/ResumeCard/index.tsx`    | ResumeCard    | Feature UI |
| `src/entities/applicants/ui/ApplicantInfo/index.tsx` | ApplicantInfo | Entity UI  |
| `src/shared/ui/StatusBadge/index.tsx`                | StatusBadge   | Shared UI  |

### DDP 구조 확인
```

src/features/applicants/
├── domain/ # 비즈니스 로직 (이미 존재 여부 확인)
├── data/ # 데이터 레이어
├── model/ # Custom Hooks
└── ui/ # ← 여기에 생성 예정
└── ResumeCard/
└── index.tsx

```

**이 구조로 진행해도 될까요?** (Y/N 또는 수정 요청)
```

### 확인 없이 진행 가능한 경우

다음 조건을 **모두** 만족할 때만 확인 생략 가능:

1. 기존 컴포넌트 **수정**만 하는 경우 (신규 생성 없음)
2. 동일 폴더 내 파일 추가 (기존 구조 유지)
3. `src/shared/ui/` 내 단순 유틸리티 컴포넌트

### DDP 레이어 연동 확인

Feature UI 생성 시, 해당 Feature의 DDP 레이어 존재 여부 확인:

```typescript
// Feature UI 생성 전 확인할 파일들
const ddpFiles = [
  'src/features/{feature}/domain/entities.ts', // Entity 정의
  'src/features/{feature}/domain/repository.ts', // Repository 인터페이스
  'src/features/{feature}/domain/services.ts', // Use Cases
  'src/features/{feature}/data/mapper.ts', // DTO 변환
  'src/features/{feature}/data/repository.impl.ts', // Repository 구현
  'src/features/{feature}/model/hooks/', // Custom Hooks
];

// 존재하지 않는 레이어가 있으면 안내
// "이 Feature에는 domain 레이어가 없습니다. UI만 생성할까요?"
```

## 🧰 Tailwind Config 읽기 가드레일 (토큰/속도 최적화)

- 기본 원칙: `tailwind.config.mjs`는 **전체 read보다 “필요 섹션만” 확인**을 우선한다.
- 권장 순서:
  1. (가능하면) `grep`로 필요한 키만 찾기: `colors`, `spacing`, `fontSize`, `borderRadius`, `boxShadow`
  2. 매칭 실패 시에만 해당 구간을 `read_file`로 부분 읽기
- 금지:
  - tailwind.config.mjs를 반복적으로 전체 read
  - 유사값 탐색을 위한 대규모 스캔(정확 매칭 실패 시 arbitrary value 사용)

## ✅ Prettier/Lint 검증 (필수)

- 목적:
  - import 순서: Prettier(정렬 플러그인)로 자동 정렬/검증
  - props 순서: ESLint `react/jsx-sort-props`로 검증(현재 warn)
- 권장 실행(변경 파일만):
  - Prettier check:
    - `pnpm prettier --check <변경파일1> <변경파일2> ...`
  - ESLint check(Next lint):
    - `pnpm lint:check -- --file <변경파일1> --file <변경파일2> ...`
- 실패 시:
  - 포맷 자동 수정: `pnpm prettier <변경파일...>` (write)
  - 린트 자동 수정: `pnpm lint` (fix)

- **서브 에이전트를 거치는 경우** (권장):
  - 복잡한 화면 (5개 이상 컴포넌트 / 폼 요소 많음 / 재사용 후보 많음)
  - 매핑 정확도가 중요한 경우
- **서브 없이 바로 구현** (허용):
  - 단순한 화면 (단일 컴포넌트 / 재사용만)
  - 빠른 프로토타입

## 🎯 핵심 원칙

### ⚠️ 스타일링 규칙 (CRITICAL)

**이 스킬에서는 Tailwind CSS만 사용합니다.**

- ✅ Tailwind CSS 클래스 사용
- ❌ vanilla-extract (`index.css.ts`) 생성 금지
- ❌ CSS-in-JS 패턴 사용 금지

> 프로젝트 전역 규칙(`.cursor/rules/`)에서 vanilla-extract를 권장하더라도,
> Figma → 컴포넌트 변환 작업에서는 이 스킬 문서의 규칙이 우선합니다.

**🔄 스타일 변환 참조:**

- JDS 레이아웃 컴포넌트 변환: [jds-to-tailwind 스킬](../jds-to-tailwind/SKILL.md)
- Vanilla Extract 스타일 변환: [vanilla-to-tailwind 스킬](../vanilla-to-tailwind/SKILL.md)

### 1. Figma 토큰 이름 우선 (테마 안전)

```
Figma 토큰 이름 (get_variable_defs) ✅ 최우선
  ↓ (토큰 없을 경우)
색상 값 정확 매칭 ✅
  ↓ (정확 매칭 실패)
arbitrary value [정확한 값] 🎨
```

**예시:**

```javascript
// ✅ 토큰 이름 매칭 (테마 안전)
Figma: "jk/button/primary" (#003cff) → bg-jk-button-primary

// ✅ 색상 정확 매칭
Figma: #0057ff → bg-blue-700

// 🎨 정확한 값 사용 (유사한 값 사용 금지!)
Figma: #0058ff → bg-[#0058ff]
```

**⚠️ CRITICAL: base 계층 색상 규칙**

```javascript
// base 색상은 반드시 "base-" prefix 사용
// tailwind.config.mjs 구조:
// colors: {
//   base: { white, black, dimed }  ← 중첩 구조
// }

// ✅ 올바른 사용
Figma: "white" → text-base-white, bg-base-white
Figma: "black" → text-base-black, bg-base-black
Figma: "dimed" → text-base-dimed, bg-base-dimed

// ❌ 절대 금지 (Tailwind에서 인식 불가)
Figma: "white" → text-white, bg-white
Figma: "black" → text-black, bg-black
Figma: "dimed" → text-dimed, bg-dimed
```

### 2. tailwind.config.mjs 정확한 매칭만

- ❌ 유사한 값 찾기 금지
- ✅ 정확히 일치하는 값만 사용
- 🎨 매칭 실패 시 arbitrary value 사용

### 3. 컴포넌트 우선순위

1. **로컬 컴포넌트** (indexer 기반 재사용)
   - 대상 레이어(기본): `src/shared/ui`, `src/features/**/ui`, `src/entities/**/ui`
   - 규칙: 로컬 재사용 탐색은 **`repo-component-indexer` 결과(matches)만 사용**한다. (직접 스캔/exists 금지)
2. **@jds/theme 컴포넌트**
   - 레이아웃 전용 컴포넌트 → Tailwind로 변환
     - `Flex`, `Block`, `Box` → `div` + Tailwind
     - `Typography` → `p`, `span`, `h1-h6` + Tailwind
     - **변환 방법**: [jds-to-tailwind 스킬](..//jds-to-tailwind/SKILL.md) 참조
   - Vanilla Extract 스타일 → Tailwind로 변환
     - `index.css.ts` → Tailwind 클래스
     - **변환 방법**: [vanilla-to-tailwind 스킬](../vanilla-to-tailwind/SKILL.md) 참조
   - UI 컴포넌트 → 그대로 사용
     - `Button`, `Checkbox`, `TextField`, `SelectBox` 등

   - ✅ **Form 요소는 항상 `@jds/theme`을 사용 (필수)**
     - 대상: `Checkbox`, `Radio`, `SelectBox`, `TextField`, `Textarea`
     - 규칙: 위 Form 요소는 **로컬에 동일 UI가 있지 않는 한** `@jds/theme` 컴포넌트를 그대로 사용한다.
     - 금지: 위 Form 요소를 `div` + Tailwind로 재구현하거나, `@jds/*` 코어(headless) 패키지로 조합해 만들지 않는다.

   - ⚠️ **Button 컴포넌트 width 처리 (CRITICAL)**
     - @jds/theme Button은 기본적으로 content 크기에 맞춰짐
     - **Figma에서 width가 명시된 경우 반드시 className으로 Tailwind 클래스 전달**:
       - 전체 너비: `className="w-full"`
       - 고정 너비: `className="w-[368px]"` (Figma 값 그대로)
       - 부모 크기: `className="w-full"` 또는 외부 wrapper로 처리
     - 예시:

       ```tsx
       // ✅ Figma에서 width가 368px인 경우
       <Button className="w-[368px]">버튼</Button>

       // ✅ Figma에서 width가 부모 전체인 경우
       <Button className="w-full">버튼</Button>

       // ❌ className 생략 (버튼이 content 크기로 축소됨)
       <Button>버튼</Button>
       ```

3. **신규 컴포넌트** - Figma `data-name` 사용, 별도 파일로 분리

## ✅ Claude CLI Task Runner 프로토콜 (필수)

Claude CLI는 아래 규칙으로만 동작한다.

### 1) 태스크 생성/실행 규칙

- 실행 전, 전체 작업을 3~7개의 Task로 쪼개고 **순서를 확정**한다.
- **한 번에 하나의 Task만 실행**한다. (병렬 실행 금지)
- 각 Task는 "완료 조건(DoD)"을 1줄로 포함한다.
- **사용자에게 선택지를 제시하지 않는다.** (A/B 중 선택 질문 금지)
- 막히는 경우에만 질문한다: (필수 입력/권한/리소스 부족, 요구사항 상충)

- ✅ **(추가) 완료 전 최종 검증(Figma 재검증) 필수**
  - 모든 구현/수정 Task가 끝나면, **요청 받은 Figma 디자인을 1회 재검증하는 Task를 반드시 수행**한다.
  - 이 검증 Task가 통과하기 전에는 "완료"를 선언하지 않는다.
  - 검증 기준(필수):
    1. **레이아웃은 무조건 동일**해야 한다.
    2. **컬러/간격/텍스트/폼 요소는 완전히 동일**해야 한다.
    3. **아이콘 처리**: 서브 에이전트 `icon-mapper` 호출하여 매핑 (매핑 실패 시 유사 아이콘 또는 placeholder 사용)

### 2) 터미널 출력 규칙(진행표)

- Claude CLI는 Task 시작 시점에 아래 형식으로 "진행표"를 출력한다.
- Task 완료 후에는 **완료된 Task 텍스트를 취소선 처리**하여 다시 출력한다.
- 터미널이 ANSI 취소선(SGR 9)을 지원하면 ANSI를 사용하고, 미지원이면 Markdown 취소선(~~ ~~)로 출력한다.
- 이전 줄을 편집(커서 이동)할 수 없으면, "진행표 전체를 매번 다시 출력"해도 된다.

### 3) 출력 포맷(예시)

[Task Plan]

1. Tailwind/JDS/로컬 컴포넌트 스택 분석 (DoD: 적용 규칙 확정)
2. Figma 데이터 수집 + 토큰 매핑 테이블 생성 (DoD: 색/spacing/typo 매핑 완료)
3. 컴포넌트 생성/수정 + 로컬 재사용 반영 (DoD: 빌드/렌더 확인)

[Progress]

- 1. Tailwind/JDS/로컬 컴포넌트 스택 분석 (DoD: 적용 규칙 확정)
- 2. Figma 데이터 수집 + 토큰 매핑 테이블 생성 (DoD: 색/spacing/typo 매핑 완료)
- 3. 컴포넌트 생성/수정 + 로컬 재사용 반영 (DoD: 빌드/렌더 확인)

(1번 완료 후 재출력)

[Progress]

- ~~1) Tailwind/JDS/로컬 컴포넌트 스택 분석 (DoD: 적용 규칙 확정)~~
- 2. Figma 데이터 수집 + 토큰 매핑 테이블 생성 (DoD: 색/spacing/typo 매핑 완료)
- 3. 컴포넌트 생성/수정 + 로컬 재사용 반영 (DoD: 빌드/렌더 확인)

### 4) ANSI 취소선 출력 가이드(가능한 경우)

- 취소선 ON: ESC[9m, OFF/리셋: ESC[0m
- 예: "\x1b[9m완료된 태스크\x1b[0m"

## 워크플로우

> 상세 가이드: [execution-order.md](references/execution-order.md)

### 0. URL 파싱 및 기본 검증

```typescript
// URL 파싱
const { fileKey, nodeId } = parseFigmaUrl(url);
// "8719-318931" → "8719:318931" 변환
```

### 1. Figma 데이터 수집

```typescript
// 병렬 데이터 수집
const [designContext, variableDefs, tailwindHint] = await Promise.all([
  user_figma_get_design_context({ fileKey, nodeId }),
  user_figma_get_variable_defs({ fileKey, nodeId }), // 필수!
  // ✅ Tailwind config는 전체 read보다 "필요 섹션만" 우선 확인
  readTailwindConfigHint(), // (예) grep 기반으로 colors/spacing/fontSize/radius/shadow 존재 여부만 요약
]);

// tailwindHint로도 매핑이 불명확할 때만 부분 read
const tailwindConfig = tailwindHint.needsPartialRead ? await readTailwindConfigPartial(tailwindHint) : tailwindHint;
```

### 2. 🏗️ DDP 아키텍처 확인 (필수)

**⚠️ 파일 생성 전 반드시 사용자 승인을 받아야 합니다.**

1. **컴포넌트 유형 결정**: [component-type-decision.md](references/component-type-decision.md) 참조
   - 공용 UI / 엔티티 UI / 기능 UI / 뷰 / 위젯

2. **폴더 구조 확인 요청**:

```markdown
## 📁 폴더 구조 확인

| 파일 경로                                         | 컴포넌트명  | 유형      |
| ------------------------------------------------- | ----------- | --------- |
| `src/entities/applicants/ui/ResumeCard/index.tsx` | ResumeCard  | 엔티티 UI |
| `src/shared/ui/StatusBadge/index.tsx`             | StatusBadge | 공용 UI   |

**어떻게 진행할까요?**

1. ✅ 이 구조로 진행
2. 📝 경로 수정 요청
3. ⏸️ 잠시 대기
```

3. **사용자 승인 대기** → 승인 후 다음 단계 진행

### 3. 노드 분류 및 컴포넌트 재사용 (Indexer 기반)

**목표:** “매 작업/매 노드마다 로컬 트리 스캔”을 금지하고, **indexer 결과**로만 재사용 결정을 내린다.

---

#### 2-0) (필수) Indexer 호출로 컴포넌트 매칭 확보

- Figma `designContext`에서 노드명 후보를 수집한다:
  - `data-name` (우선)
  - `node.name` (대체)
  - CodeConnectSnippet이 준 import 정보(있으면 최우선)

- 아래 서브 에이전트를 호출해 매칭 결과를 만든다:
  - **Sub Agent:** `repo-component-indexer`
  - 입력:
    - `nodeNames`: string[] (재사용 후보 이름 목록)
    - `codeConnectImports`: { name: string; importPath: string }[] (있으면)
    - `targetLayers`: ["src/shared/ui","src/features/**/ui","src/entities/**/ui"] (기본값)

- 이후 모든 노드 처리에서 “로컬 탐색/exists/트리 스캔”을 하지 말고,
  **indexer의 `matches`만 조회**한다.

---

#### 🔍 컴포넌트 검색 순서 (인덱스 우선, 강제)

```
// 0) CodeConnectSnippet이 importPath를 주면 무조건 사용 (추가 탐색 금지)
if (codeConnectImport) {
  return useCodeConnect(codeConnectImport);
}

// 1) Indexer 매칭 결과로 로컬 컴포넌트 재사용
const match = indexerMatches[nodeName];
if (match?.decision === 'use_local') {
  return useLocalComponent(match.importPath, match.componentName);
}

// 2) @jds/theme 컴포넌트 확인
const jdsComponent = checkJdsTheme(nodeName);
if (jdsComponent) {
  // 레이아웃 컴포넌트 → Tailwind 변환
  // 📚 변환 가이드: ../jds-to-tailwind/SKILL.md 참조
  if (['Flex', 'Block', 'Box', 'Typography'].includes(nodeName)) {
    return convertToTailwind(node);
  }
  // UI 컴포넌트 → 그대로 사용
  return useJdsTheme(nodeName);
}

// 3) 신규 컴포넌트 생성
return createNewComponent(node);
```

---

#### 📋 노드 타입별 처리 (Indexer 결과 사용)

```
// COMPONENT/INSTANCE 타입 노드 처리
if (node.type === 'COMPONENT' || node.type === 'INSTANCE') {
  const nodeName = node['data-name'] || node.name;

  // ✅ 0. CodeConnectSnippet 우선 (가능하면)
  const codeConnectImport = findCodeConnectImport(nodeName);
  if (codeConnectImport) {
    return {
      import: codeConnectImport.import, // 제공된 import 그대로 사용
      usage: codeConnectImport.usage,
    };
  }

  // ✅ 1. Indexer 매칭 우선 (로컬 트리 스캔 금지)
  const matched = indexerMatches[nodeName];
  if (matched?.decision === 'use_local') {
    return {
      import: `import ${matched.componentName} from "${matched.importPath}";`,
      usage: `<${matched.componentName} {...props} />`,
    };
  }

  // ✅ 2. @jds/theme 컴포넌트 확인
  if (isJdsThemeComponent(nodeName)) {
    return {
      import: `import { ${nodeName} } from "@jds/theme";`,
      usage: `<${nodeName} {...props} />`,
    };
  }

  // ✅ 3. 신규 컴포넌트 생성
  return createSeparateComponentFile(nodeName, node);
}

// FRAME, GROUP → div + Tailwind
// TEXT → p/span/h1-h6 + Tailwind
```

---

#### 🚫 토큰 가드레일 (반드시 지킬 것)

- ❌ `searchLocalComponent(nodeName)` 같은 “레포 전체 탐색” 금지
- ❌ `exists("src/components/${nodeName}/index.tsx")` 같은 추측 기반 반복 IO 금지
- ✅ 로컬 재사용 판단은 **indexer 결과**로만 수행
- ✅ indexer가 반환한 파일만 “필요한 라인”을 read하여 props/사용법을 확인

**토큰 매핑 (토큰 이름 우선):**

```javascript
function mapColorToTailwind(figmaColor, figmaTokenName, tokens, variableDefs) {
  // 1. 토큰 이름 매칭 (최우선 - 테마 안전!)
  if (figmaTokenName && variableDefs[figmaTokenName]) {
    let tokenName = figmaTokenName.replace(/\//g, '-');

    // ⚠️ CRITICAL: base 색상 처리
    // "white", "black", "dimed" → "base-white", "base-black", "base-dimed"
    if (['white', 'black', 'dimed'].includes(tokenName)) {
      tokenName = `base-${tokenName}`;
    }

    if (findTokenInConfig(tokenName, tokens.colors)) {
      return tokenName; // "jk-button-primary" or "base-white"
    }
  }

  // 2. 색상 정확 매칭
  for (const [name, value] of Object.entries(tokens.colors)) {
    if (value.toLowerCase() === figmaColor.toLowerCase()) {
      return name; // "blue-700"
    }
  }

  // 3. 정확한 값 사용 (유사한 값 사용 안함!)
  return `[${figmaColor}]`; // "[#abc123]"
}
```

### 4. 컴포넌트 생성 및 재사용

**🔄 컴포넌트 재사용 전략:**

모든 레벨의 컴포넌트에서 로컬/JDS 컴포넌트를 최대한 재사용합니다.

**⚠️ 스타일 변환 참조:**

- JDS 레이아웃 컴포넌트 변환: [jds-to-tailwind 스킬](../jds-to-tailwind/SKILL.md)
- Vanilla Extract 스타일 변환: [vanilla-to-tailwind 스킬](../vanilla-to-tailwind/SKILL.md)

```typescript
// ✅ 좋은 예: 기존 컴포넌트 재사용
import BZWRegistControl from "@/components/BZWRegistControl"; // 로컬
import { Checkbox, TextField } from "@jds/theme"; // JDS

function ContactInfo() {
  return (
    <div>
      <BZWRegistControl /> {/* ✅ 로컬 컴포넌트 재사용 */}
      <Checkbox /> {/* ✅ JDS 컴포넌트 재사용 */}
      <TextField.Root /> {/* ✅ JDS 컴포넌트 재사용 */}
    </div>
  );
}
```

```typescript
// ❌ 나쁜 예: 컴포넌트 재생성
function ContactInfo() {
  return (
    <div>
      {/* ❌ BZWRegistControl이 로컬에 있는데 새로 만듦 */}
      <div className="flex gap-8 px-16 py-12 border rounded-8">
        {/* ... BZWRegistControl 내용 복제 */}
      </div>
    </div>
  );
}
```

**📂 생성 전 검색:**

```typescript
// ✅ Indexer 기반(권장): 로컬 트리 직접 스캔 금지
// - nodes에서 nodeNames를 수집하고 repo-component-indexer를 호출해 matches를 받는다.
// - 이후에는 matches만 조회하여 재사용/생성 결정을 내린다.

const nodeNames = nodes.map(node => node['data-name'] || node.name);

const indexerResult = await callSubAgent('repo-component-indexer', {
  nodeNames,
  targetLayers: ['src/shared/ui', 'src/features/**/ui', 'src/entities/**/ui'],
});

for (const node of nodes) {
  const nodeName = node['data-name'] || node.name;
  const match = indexerResult.matches?.[nodeName];

  if (match?.decision === 'use_code_connect' || match?.decision === 'use_local') {
    // ✅ 재사용 (importPath/componentName/exportKind는 indexer가 제공)
    addImportFromMatch(match);
    continue;
  }

  if (match?.decision === 'use_jds') {
    addJdsImport(match);
    continue;
  }

  // 신규 생성
  createNewComponent(nodeName, node);
}
```

**📁 계층 구조:**

```
src/components/
├── ApplicationGuidance/   # 메인
│   └── index.tsx
├── ContactInfo/           # 서브 (BZWRegistControl 재사용)
│   └── index.tsx
├── BZWRegistControl/      # 기존 컴포넌트 (재사용됨 ✅)
│   └── index.tsx
├── BZWLabel/              # 신규 생성
│   └── index.tsx
└── BZWIconBtn/            # 신규 생성
    └── index.tsx
```

**예시: 재사용 포함 컴포넌트:**

```tsx
// src/components/ContactInfo/index.tsx
import React from 'react';
import BZWIconBtn from '@/components/BZWIconBtn'; // 신규
import BZWLabel from '@/components/BZWLabel'; // 신규

import BZWRegistControl from '@/components/BZWRegistControl'; // ✅ 기존 재사용

export interface ContactInfoProps {
  contactName?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ contactName }) => (
  <div className='flex flex-col gap-12'>
    <div className='flex items-center justify-between'>
      <BZWLabel>{contactName}</BZWLabel>
      <BZWIconBtn icon={<EditIcon />} />
    </div>

    {/* ✅ 기존 BZWRegistControl 컴포넌트 재사용 */}
    <BZWRegistControl />
  </div>
);
```

### 5. ✅ 완료 전 최종 검증: Figma 재검증 (필수)

구현/수정 완료 후, 요청 받은 Figma URL/노드로 돌아가 **최종 검증**한다.
검증이 통과하기 전에는 완료를 선언하지 않는다.

**검증 기준(필수):**

1. **레이아웃은 무조건 동일**해야 한다. (정렬/배치/그룹 구조/폭·높이·제약 포함)
2. **컬러, 간격, 텍스트, 폼 요소는 완전히 동일**해야 한다.
   - 컬러: 토큰/값이 정확히 일치
   - 간격: padding/margin/gap이 정확히 일치
   - **Width/Height: 1px 포함 모든 값이 정확히 일치** ⚠️ CRITICAL
     - Figma width: 1px → Tailwind: `w-px` (필수!)
     - Figma height: 60px → Tailwind: `h-[60px]` (정확한 값)
     - 구분선(divider): width 1px 또는 height 1px 반드시 확인
   - 텍스트: fontSize/weight/lineHeight/letterSpacing/color 및 줄바꿈 동작 포함
   - 폼 요소: 상태/스타일/크기/라벨 배치가 동일
3. **아이콘 처리**: 서브 에이전트 `icon-mapper` 호출하여 매핑
   - 아이콘 노드 발견 시 `icon-mapper` 서브 에이전트 호출
   - 매핑 실패 시 유사 아이콘 또는 placeholder 사용 (주석으로 원본 명시)
   - 아이콘으로 인해 레이아웃이 달라지면 안 됨

**불일치 발견 시 처리:**

- 불일치가 있으면 수정 Task를 추가하고 수정 후 이 검증 단계를 반복한다.

**DoD(검증 단계):**

- "레이아웃 동일, 컬러/간격/텍스트/폼 요소 완전 동일, 아이콘은 icon-mapper로 매핑"

## 매핑 규칙

### 색상 매핑

```javascript
// ✅ 토큰 이름 → 클래스
"jk/button/primary" → "jk-button-primary"

// ✅ 정확한 값 → 클래스
#0057ff → "blue-700"

// 🎨 정확한 값 사용
#0058ff → "[#0058ff]"

// ⚠️ CRITICAL: base 색상은 반드시 prefix 사용
"white" → "base-white" (text-base-white, bg-base-white)
"black" → "base-black" (text-base-black, bg-base-black)
"dimed" → "base-dimed" (text-base-dimed, bg-base-dimed)

// ❌ 절대 금지
"white" → "white" (text-white는 인식 불가)
```

### Spacing 매핑

```javascript
// ✅ 정확 매칭
16px → "16"

// 🎨 정확한 값 사용
17px → "[17px]"
```

### Width/Height 매핑

```javascript
// ⚠️ CRITICAL: width, height 값은 정확히 검증 필수!

// ✅ 고정 크기 - Tailwind 클래스 사용
width: 1px → "w-px"
height: 1px → "h-px"
width: 24px → "w-[24px]"
height: 60px → "h-[60px]"

// ✅ 유동 크기 - Tailwind 클래스 사용
width: 100% → "w-full"
height: 100% → "h-full"
width: auto → "w-auto"

// ✅ Flexbox 크기
flex: 1 → "flex-1" 또는 "flex-[1_0_0]"
min-width: 0 → "min-w-0" 또는 "min-w-px"

// ❌ 절대 금지: 1px을 무시하거나 생략
Figma: width 1px → 반드시 "w-px" 적용!
```

### Layout 매핑

```javascript
// Figma Auto Layout → Tailwind Flexbox
{
  layoutMode: "HORIZONTAL",
  itemSpacing: 8,
  paddingLeft: 16,
  paddingTop: 10
}
// → "flex flex-row gap-8 px-16 py-10"
```

## 중요 규칙

### 컴포넌트 생성 스타일(React/Next)

- **규칙**: 컴포넌트는 `React.FC` 타입을 사용해서 생성하지 않는다.
  - ❌ `const Card: React.FC<CardProps> = (...) => { ... }`
  - ✅ `const Card = (props: CardProps) => { ... }`
  - ✅ `const Card = () => { ... }` (props 없을 때)

- **기본 템플릿 (props 있음)**

export interface CardProps {
className?: string;
// ... props ...
}

const Card = ({ className = "" }: CardProps) => {
return (

<div className={className}>
{/_ ... _/}
</div>
);
};

export default Card;- **기본 템플릿 (props 없음)**

const Card = () => {
return <div>{/_ ... _/}</div>;
};

export default Card;

```tsx
export interface CardProps {
  className?: string;
  // ... props ...
}
const Card = ({ className = '' }: CardProps) => {
  return <div className={className}>{/* ... */}</div>;
};
export default Card;
```

- **기본 템플릿 (props 없음)**

const Card = () => {
return <div>{/_ ... _/}</div>;
};

export default Card;

### ✅ 해야 할 것

- **URL 감지 즉시 실행** (질문하지 않음)
- **`get_variable_defs()` 필수 호출** (토큰 매핑용)
- **로컬 컴포넌트 최우선 검색** (src/components/\*\*/index.tsx)
  - 모든 COMPONENT/INSTANCE 노드에 대해 검색
  - 존재하면 무조건 재사용 (새로 만들지 않음)
- **@jds/theme 컴포넌트 확인**
  - UI 컴포넌트는 그대로 사용
  - 레이아웃 컴포넌트는 Tailwind 변환 ([jds-to-tailwind 스킬](../jds-to-tailwind/SKILL.md) 참조)
  - Vanilla Extract 스타일은 Tailwind 변환 ([vanilla-to-tailwind 스킬](../vanilla-to-tailwind/SKILL.md) 참조)
  - **Button 사용 시 className으로 width 필수 전달** ⚠️
    - Figma에서 width가 명시되어 있으면 `className="w-full"` 또는 정확한 Tailwind 클래스 전달
    - 예: `<Button className="w-full">버튼</Button>`
- **Figma 토큰 이름 우선 매칭** (테마 안전)
- **정확한 값만 사용** (유사한 값 금지)
- **Figma `data-name` 속성 사용**
- **Width/Height 1px 포함 모든 값 정확히 적용** (구분선, border 등)

### ❌ 하지 말아야 할 것

- **URL 받고 질문하기**
- **단계별 승인 요청**
- **유사한 값 찾기**
- **로컬에 있는 컴포넌트 재생성** ⚠️ 중요!
  - 예: BZWRegistControl이 이미 있으면 재사용
- **모든 컴포넌트 인라인 작성**
- **레이아웃에 @jds/theme 사용** (Flex, Box 등)
  - 대신 Tailwind CSS로 변환 ([jds-to-tailwind 스킬](../jds-to-tailwind/SKILL.md) 참조)
- **vanilla-extract 사용 금지** ⚠️ CRITICAL
  - `index.css.ts` 파일 생성 금지
  - `@vanilla-extract/css` import 금지
  - 기존 Vanilla Extract 스타일은 Tailwind로 변환 ([vanilla-to-tailwind 스킬](../vanilla-to-tailwind/SKILL.md) 참조)
  - 모든 스타일은 Tailwind CSS 클래스로 작성

## 참고 자료

### [변환 예시 및 디버깅 가이드](references/examples.md)

**포함된 내용:**

- 기본 컴포넌트 생성 패턴
- 로컬/JDS 컴포넌트 재사용 예시
- 토큰 매핑 예시 (색상, spacing, width/height, layout)
- Indexer 기반 재사용 예시
- 아이콘 처리 예시 (icon-mapper 호출)
- 디버깅 시나리오 (토큰 없음, 매칭 실패, width 1px 누락 등)
- 전체 워크플로우 예시 (Figma URL → 컴포넌트 생성)
- 금지 패턴 예시
- 변환 체크리스트

### [작업 리포트 가이드](references/report.md)

**포함된 내용:**

- 리포트 템플릿 (작업 개요, 생성/수정 컴포넌트, 토큰 매핑 등)
- 리포트 예시
- 리포트 작성 가이드

### 스타일 변환 스킬

- **[JDS to Tailwind 스킬](../jds-to-tailwind/SKILL.md)**
  - JDS 레이아웃 컴포넌트(`Flex`, `Box`, `Block`, `Typography`)를 Tailwind CSS로 변환
  - Props 매핑 테이블 (gap, padding, margin, width/height, color 등)
  - Typography 변환 규칙 (variant, weight, color)
  - 변환 예시 및 체크리스트

- **[Vanilla to Tailwind 스킬](../vanilla-to-tailwind/SKILL.md)**
  - Vanilla Extract CSS (`index.css.ts`)를 Tailwind CSS로 변환
  - JDS 토큰 → Tailwind 토큰 매핑
  - 특수 케이스 처리 (pseudo selectors, keyframes, 스크롤바 스타일 등)
  - 복잡한 CSS 속성 변환 가이드

## 제한사항

- 복잡한 이미지는 SVG export 필요
- Smart Animate는 수동 구현 필요
- 웹 폰트 사용 가능 여부 확인 필요
