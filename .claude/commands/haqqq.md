---
description: Haiku Assisted Question (Deep) - 7-10 clarifying questions before /ha
---

ultrathink.

# /haqqq - Haiku Assisted Question (Deep Mode)

**Output all responses in Korean.**

## User Request

$ARGUMENTS

---

## Your Role

You are a **pre-implementation analyst**. Your job is to:

1. Analyze the user's request thoroughly
2. Explore the codebase comprehensively to understand all context
3. Identify ALL ambiguities that could lead to incorrect implementation
4. Ask **7-10 targeted questions** using AskUserQuestion tool
5. After receiving answers, automatically execute /ha with the clarified specification

**DO NOT implement anything yourself. Your output is a refined specification for /ha.**

---

## Phase 1: Comprehensive Codebase Exploration (Automatic)

### 1-1. Request Analysis (Deep)

Parse the user's request to identify:

- **Target**: What component/feature/file is involved?
- **Action**: What needs to be done? (create, modify, connect, etc.)
- **Context clues**: Any mentioned classes, components, patterns, etc.
- **Implicit requirements**: What's not said but expected?
- **Dependencies**: What other components might be affected?

### 1-2. Extensive Code Discovery

Use these tools comprehensively:

| Tool   | When to Use                                                    |
| ------ | -------------------------------------------------------------- |
| `Grep` | Find ALL related implementations, search for patterns          |
| `Glob` | Locate files by pattern (e.g., `**/*Modal*.tsx`, `**/use*.ts`) |
| `Read` | Read specific file contents, understand full implementation    |

**Find ALL similar implementations** - This is critical for comprehensive analysis.

### 1-3. Project Architecture Reference

**프로젝트 구조**: Feature-Sliced Design (FSD)

```
src/
├── app/                    # Next.js App Router pages and layouts
│   └── [routes]/
│       ├── page.tsx       # Page component
│       └── layout.tsx     # Layout component
├── views/                  # Page-level business logic (FSD Pages layer)
│   └── [domain]/
│       ├── ui/            # Page UI components
│       └── model/         # Page-level hooks, state
├── widgets/                # Composite UI blocks combining multiple features
│   └── [domain]/
│       ├── [Widget]/      # Widget component
│       └── index.ts       # Exports
├── features/               # Business functionality modules
│   └── [domain]/
│       ├── api/           # API call logic (fetch + client)
│       ├── model/         # Business logic (hooks, stores, types)
│       ├── ui/            # Feature-specific UI components
│       ├── lib/           # Utility functions
│       └── config/        # Configuration
├── entities/               # Business entities and core models
│   └── [entity]/
│       ├── model/         # Entity types, schemas
│       └── lib/           # Entity utilities
└── shared/                 # Common resources used across all layers
    ├── config/            # Global configuration
    ├── fetch/             # API client setup
    ├── styles/            # Global styles
    ├── ui/                # Common UI components (BZW*, JDS)
    ├── types/             # Common type definitions
    └── utils/             # Utility functions
```

**기술 스택**:

- **Framework**: Next.js 15.4.3 (App Router), React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Vanilla Extract CSS
- **UI Components**: JDS (JobKorea Design System) + BZW (custom components)
- **Data Fetching**: Tanstack Query 5.80.7
- **State Management**: Zustand 5.0.5
- **Forms**: React Hook Form 7.57.0 + Zod validation
- **Testing**: Vitest + Playwright + Testing Library
- **Build**: Standalone output with Bundle Analyzer support

**FSD Layer Rules** (CRITICAL):

1. **Dependency Direction**: Lower layers cannot import from higher layers
   - `shared` → no other layer imports allowed
   - `entities` → can import from `shared` only
   - `features` → can import from `entities` and `shared`
   - `widgets` → can import from `features`, `entities`, and `shared`
   - `views` → can import from `widgets`, `features`, `entities`, and `shared`
   - `app` → can import from all layers

2. **Same Layer Imports**: Features cannot directly import from other features
   - Use `widgets` layer to compose multiple features

3. **File Organization**: Each layer segment can contain:
   - `api/` - API call logic
   - `model/` - Business logic (hooks, stores, types)
   - `ui/` - UI components
   - `lib/` - Utility functions
   - `config/` - Configuration

### 1-4. Pattern Reference Discovery (Comprehensive)

Search for ALL similar implementations in the current codebase:

```
Example: If user wants to "add a data table with infinite scroll"
→ Search: ALL "DataTable" patterns, "BZWDataTable" usage
→ Search: ALL infinite scroll implementations
→ Search: ALL Tanstack Query infinite query patterns
→ Search: Related pagination, loading state patterns
→ Find: How ALL related features handle similar flows
```

**Common Patterns in This Project**:

- **Components**:
  - `src/shared/ui/BZW*/` - Custom components (BZWButton, BZWModal, BZWDataTable, etc.)
  - `@jds/theme` - JDS components (Icon, TextButtonUnderline, etc.)
- **Hooks**:
  - `use[Feature]` pattern in `model/` segments
  - Custom hooks for business logic, state, API calls
- **API Structure**:
  - `features/*/api/[feature].fetch.ts` - Fetch functions
  - `features/*/api/[feature].client.ts` - Tanstack Query hooks (useQuery, useMutation, useInfiniteQuery)
- **Forms**:
  - React Hook Form + Zod schemas
  - Form components in `features/*/ui/` or `widgets/`
- **State**:
  - Zustand stores in `features/*/model/` for global state
  - React hooks (useState, useReducer) for local state
- **Types**:
  - `[feature].types.ts` in `model/` or `entities/`
  - API types in `shared/types/api/`
- **Testing**:
  - Unit tests: `[file].test.ts` with Vitest
  - Component tests: Testing Library
  - E2E tests: Playwright

### 1-5. Interface Analysis (Complete)

For Deep mode, analyze thoroughly:

- Input/output interfaces of ALL related components
- ALL existing callback patterns in similar features
- State management approaches used across the app
- Error handling patterns
- Navigation patterns
- Data flow patterns
- Styling patterns (Vanilla Extract CSS)

### 1-6. Dependency Analysis

Identify:

- What components/files will be affected
- What imports will be needed
- What other features might break
- What tests might need updates
- What types might need to be created/updated

---

## Phase 2: Ambiguity Detection (Deep: 7-10 Questions)

### Question Categories (Cover ALL applicable)

| Category               | Example Ambiguities                              | Priority |
| ---------------------- | ------------------------------------------------ | -------- |
| **Component Choice**   | Which UI component? BZW vs JDS vs custom?        | CRITICAL |
| **Location/Placement** | Where to add code? Which layer/file?             | CRITICAL |
| **I/O Definition**     | Input props? Output callbacks? Type definitions? | CRITICAL |
| **State Management**   | Local state vs global? Which store? State shape? | HIGH     |
| **Edge Cases**         | Error handling? Empty state? Null handling?      | HIGH     |
| **Integration**        | How to connect with existing code?               | HIGH     |
| **Lifecycle**          | When to fetch data? When to cleanup?             | MEDIUM   |
| **Validation**         | Input validation? Output validation? Schema?     | MEDIUM   |
| **Styling**            | Vanilla Extract? Tailwind? Component props?      | MEDIUM   |
| **Testing**            | Unit tests? Component tests? E2E tests?          | LOW      |

### Question Selection for Deep Mode

1. **Must Ask (3-4)**: Component/pattern choice, location, I/O, primary integration
2. **Should Ask (3-4)**: State handling, edge cases, lifecycle, validation
3. **May Ask (1-2)**: Styling, testing (if applicable)

---

## Phase 3: Ask Questions with AskUserQuestion Tool

**MANDATORY: Use AskUserQuestion tool with recommendations based on codebase analysis.**

### Question Format Requirements

Each question MUST have:

1. Clear question text
2. 2-4 options with descriptions
3. **Recommended option marked** (based on existing patterns found)
4. Description explaining WHY it's recommended

### AskUserQuestion Tool Usage

**Use multiple AskUserQuestion calls (max 4 questions per call).**

For 7-10 questions:

- First call: 4 primary questions (component, location, I/O, integration)
- Second call: 3-4 secondary questions (state, edge cases, lifecycle)
- Third call (if needed): 2 tertiary questions (styling, testing, validation)

### Example Structure:

**First Batch (Critical):**

```
questions: [
  {
    "question": "어떤 데이터 테이블 컴포넌트를 사용할까요?",
    "header": "Table",
    "multiSelect": false,
    "options": [
      {"label": "BZWDataTable", "description": "추천: AG Grid 기반, 무한 스크롤 지원 (WorkspaceActivityList 참고)"},
      {"label": "새 컴포넌트", "description": "BZWDataTable로 불가능한 경우"}
    ]
  },
  {
    "question": "컴포넌트를 어디에 배치할까요?",
    "header": "Location",
    "multiSelect": false,
    "options": [
      {"label": "widgets/workspace/", "description": "추천: 여러 features 조합"},
      {"label": "features/workspace/ui/", "description": "workspace 기능에만 종속"},
      {"label": "shared/ui/", "description": "여러 도메인에서 재사용"}
    ]
  },
  {
    "question": "데이터를 어떻게 가져올까요?",
    "header": "Data",
    "multiSelect": false,
    "options": [
      {"label": "useInfiniteQuery", "description": "추천: 무한 스크롤 (Tanstack Query)"},
      {"label": "useQuery", "description": "단순 페이지네이션"},
      {"label": "Props로 전달", "description": "상위 컴포넌트에서 관리"}
    ]
  },
  {
    "question": "기존 코드와 어떻게 연결할까요?",
    "header": "Integration",
    "multiSelect": false,
    "options": [
      {"label": "새 API 엔드포인트", "description": "features/*/api/ 구조 따름"},
      {"label": "기존 API 확장", "description": "기존 fetch/client 수정"}
    ]
  }
]
```

**Second Batch (Edge Cases & State):**

```
questions: [
  {
    "question": "에러 발생 시 어떻게 처리할까요?",
    "header": "Error",
    "multiSelect": false,
    "options": [
      {"label": "에러 바운더리", "description": "추천: 컴포넌트 레벨 에러 처리"},
      {"label": "Tanstack Query error", "description": "useQuery의 error 상태 사용"},
      {"label": "토스트 메시지", "description": "BZWToast로 알림"}
    ]
  },
  {
    "question": "로딩 상태를 어떻게 표시할까요?",
    "header": "Loading",
    "multiSelect": false,
    "options": [
      {"label": "Skeleton UI", "description": "추천: 네트워크 요청 있는 경우"},
      {"label": "Spinner", "description": "간단한 로딩 표시"},
      {"label": "AG Grid 자체 로딩", "description": "BZWDataTable 내장 기능"}
    ]
  },
  {
    "question": "빈 데이터일 때 어떻게 할까요?",
    "header": "Empty",
    "multiSelect": false,
    "options": [
      {"label": "빈 상태 UI", "description": "추천: overlayNoRowsTemplate 사용"},
      {"label": "메시지만 표시", "description": "간단한 텍스트"},
      {"label": "기본값 사용", "description": "폴백 데이터"}
    ]
  },
  {
    "question": "언제 데이터를 정리(cleanup)할까요?",
    "header": "Cleanup",
    "multiSelect": false,
    "options": [
      {"label": "컴포넌트 언마운트 시", "description": "추천: useEffect cleanup"},
      {"label": "수동 호출", "description": "사용자 액션에 의해"},
      {"label": "정리 안 함", "description": "캐시 유지"}
    ]
  }
]
```

**Third Batch (If Applicable):**

```
questions: [
  {
    "question": "스타일링을 어떻게 할까요?",
    "header": "Styling",
    "multiSelect": false,
    "options": [
      {"label": "Vanilla Extract", "description": "추천: 프로젝트 표준"},
      {"label": "Tailwind 클래스", "description": "간단한 스타일링"},
      {"label": "컴포넌트 props", "description": "BZW/JDS props 활용"}
    ]
  },
  {
    "question": "테스트를 어떻게 작성할까요?",
    "header": "Testing",
    "multiSelect": true,
    "options": [
      {"label": "Unit 테스트", "description": "Vitest로 비즈니스 로직 테스트"},
      {"label": "Component 테스트", "description": "Testing Library로 UI 테스트"},
      {"label": "E2E 테스트", "description": "Playwright로 전체 플로우 테스트"},
      {"label": "테스트 생략", "description": "나중에 추가"}
    ]
  }
]
```

---

## Phase 4: Generate Refined Specification & Execute /ha

After receiving ALL user answers, create a **comprehensive specification**:

```
## Refined Specification for /ha

### Original Request
[User's original request]

### Clarified Requirements (Complete)
**Critical:**
- Q1 [Question]: [User's Answer]
- Q2 [Question]: [User's Answer]
- Q3 [Question]: [User's Answer]
- Q4 [Question]: [User's Answer]

**Edge Cases:**
- Q5 [Question]: [User's Answer]
- Q6 [Question]: [User's Answer]
- Q7 [Question]: [User's Answer]
- Q8 [Question]: [User's Answer]

**Additional:**
- Q9 [Question]: [User's Answer]
- Q10 [Question]: [User's Answer]

### Implementation Directive (Detailed)
[Concrete, unambiguous implementation instructions based on ALL answers]

### Reference Patterns
- [Similar implementation 1]: [Pattern to follow]
- [Similar implementation 2]: [Pattern to follow]

### Edge Case Handling (Complete)
- Error: [How to handle]
- Empty state: [How to handle]
- Loading: [How to handle]
- Cleanup: [How to handle]
- Null input: [How to handle]

### State Management
- Initial state: [Description]
- Loading state: [Description]
- Success state: [Description]
- Error state: [Description]

### Integration Points
- File 1: [What to modify]
- File 2: [What to modify]
- New file: [What to create]

### Dependencies
- Required imports: [List]
- Related components: [List]
- Type definitions: [List]

### FSD Layer Compliance
- Target layer: [Layer name]
- Dependencies: [Allowed dependencies]
- Exports: [What to export]
```

Then **automatically invoke /ha command** with this refined specification using the SlashCommand tool:

```
SlashCommand: /ha [Refined Specification]
```

---

## Output Format

````
🔍 요청 분석 중... (Deep Mode)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 요청 파싱:
- 대상: [Target component/feature]
- 작업: [What needs to be done]
- 컨텍스트: [Related components, patterns, etc.]
- 암묵적 요구사항: [Implicit requirements]
- 영향 범위: [Affected components]

🔎 코드베이스 탐색 중... (포괄적 분석)
[Multiple tool calls for comprehensive exploration]

📎 관련 구현 패턴 (전체):
- [Pattern 1]: [Description]
  ```typescript
  [Code snippet]
````

- [Pattern 2]: [Description]
  ```typescript
  [Code snippet]
  ```
- [Pattern 3]: [Description]

🔗 인터페이스 분석 (상세):

- Input: [Expected input format/type with details]
- Output: [Expected output format/type with details]
- State: [State management approach]
- Lifecycle: [Relevant lifecycle events]

📦 의존성 분석:

- 영향받는 파일: [List]
- 필요한 import: [List]
- 관련 테스트: [List]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Deep 질문 (7-10개)
[AskUserQuestion tool call - first batch (4)]
[AskUserQuestion tool call - second batch (3-4)]
[AskUserQuestion tool call - third batch if needed (2)]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[After receiving ALL answers]

✅ 명세 구체화 완료 (상세)

📐 Refined Specification:
[Comprehensive specification based on ALL answers]

🚀 /ha 실행 중...
[SlashCommand tool call to /ha]

```

---

## Critical Rules

1. **Comprehensive exploration** - Search for ALL related patterns
2. **Always provide recommendations** based on found patterns
3. **Deep = 7-10 questions** - cover ALL categories applicable to the task
4. **Multiple AskUserQuestion calls** - batch by priority (critical → edge cases → extras)
5. **Auto-execute /ha** after ALL answers - don't ask for confirmation
6. **Never implement code** - only analyze and clarify
7. **Include ALL analysis** - interfaces, dependencies, lifecycle, state
8. **Detailed specification** - comprehensive enough for complex implementations
9. **Follow FSD architecture** - STRICTLY respect layer boundaries
10. **Check CLAUDE.md** - Follow ALL project-specific patterns and prohibited practices
11. **Type safety** - Never use `any` type, define proper interfaces
12. **Component reuse** - ALWAYS prefer BZW/JDS components before creating new ones
```
