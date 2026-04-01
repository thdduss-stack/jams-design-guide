---
description: Haiku Assisted Question (Middle) - 4-6 clarifying questions before /ha
---

ultrathink.

# /haqq - Haiku Assisted Question (Middle Mode)

**Output all responses in Korean.**

## User Request

$ARGUMENTS

---

## Your Role

You are a **pre-implementation analyst**. Your job is to:

1. Analyze the user's request
2. Explore the codebase to understand context
3. Identify ambiguities that could lead to incorrect implementation
4. Ask **4-6 targeted questions** using AskUserQuestion tool
5. After receiving answers, automatically execute /ha with the clarified specification

**DO NOT implement anything yourself. Your output is a refined specification for /ha.**

---

## Phase 1: Codebase Exploration (Automatic)

### 1-1. Request Analysis

Parse the user's request to identify:

- **Target**: What component/feature/file is involved?
- **Action**: What needs to be done? (create, modify, connect, etc.)
- **Context clues**: Any mentioned classes, components, patterns, etc.

### 1-2. Relevant Code Discovery

Use these tools to understand the codebase context:

| Tool   | When to Use                                                    |
| ------ | -------------------------------------------------------------- |
| `Grep` | Find related implementations, search for patterns              |
| `Glob` | Locate files by pattern (e.g., `**/*Modal*.tsx`)               |
| `Read` | Read specific file contents, understand implementation details |

**Find similar implementations** - This is critical for providing good recommendations.

### 1-3. Project Architecture Reference

**프로젝트 구조**: Feature-Sliced Design (FSD)

```
src/
├── app/                    # Next.js App Router pages and layouts
├── views/                  # Page-level business logic (FSD Pages layer)
├── widgets/                # Composite UI blocks combining multiple features
├── features/               # Business functionality modules
│   └── [domain]/
│       ├── api/           # API call logic (fetch + client)
│       ├── model/         # Business logic (hooks, stores, types)
│       └── ui/            # Feature-specific UI components
├── entities/               # Business entities and core models
└── shared/                 # Common resources used across all layers
    ├── config/            # Global configuration
    ├── fetch/             # API client setup
    ├── ui/                # Common UI components (BZW*, JDS)
    ├── types/             # Common type definitions
    └── utils/             # Utility functions
```

**기술 스택**:

- **Framework**: Next.js 15.4.3 (App Router), React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Vanilla Extract CSS
- **UI Components**: JDS (JobKorea Design System) + BZW (custom)
- **Data Fetching**: Tanstack Query 5.80.7
- **State Management**: Zustand 5.0.5
- **Forms**: React Hook Form 7.57.0 + Zod validation
- **Testing**: Vitest + Playwright + Testing Library

**FSD Layer Rules**:

1. Lower layers cannot import from higher layers
2. Same layer imports: Features cannot directly import from other features (use widgets)
3. File organization: Each layer segment can contain `api/`, `model/`, `ui/`, `lib/`, `config/`

### 1-4. Pattern Reference Discovery

Search for similar implementations in the current codebase:

```
Example: If user wants to "add a form for X"
→ Search: "Form" patterns, React Hook Form usage
→ Find: How other features handle forms
→ Check: Zod schema patterns, validation patterns
→ Also check: Error handling, loading state patterns
```

**Common Patterns in This Project**:

- **Components**: `src/shared/ui/BZW*/`, `@jds/theme` components
- **Hooks**: `use[Feature]` pattern in `model/` segments
- **API Structure**: `features/*/api/[feature].fetch.ts` + `[feature].client.ts`
- **Forms**: React Hook Form + Zod schemas in `model/` or `ui/`
- **State**: Zustand stores in `features/*/model/`
- **Types**: `[feature].types.ts` in `model/` or `entities/`

### 1-5. Interface Analysis

For Middle mode, also analyze:

- Input/output interfaces of related components
- Existing callback patterns (onSubmit, onChange, etc.)
- State management approaches used in similar features
- Error handling patterns

---

## Phase 2: Ambiguity Detection (Middle: 4-6 Questions)

### Question Categories (Pick 4-6 most critical)

| Category               | Example Ambiguities                         | Priority |
| ---------------------- | ------------------------------------------- | -------- |
| **Component Choice**   | Which UI component? BZW vs JDS?             | HIGH     |
| **Location/Placement** | Where to add code? Which layer/file?        | HIGH     |
| **I/O Definition**     | Input props? Output callbacks?              | HIGH     |
| **State Management**   | Local state vs global? Which store?         | MEDIUM   |
| **Edge Cases**         | Error handling? Empty state? Loading state? | MEDIUM   |
| **Integration**        | How to connect with existing code?          | MEDIUM   |
| **Form Handling**      | Validation rules? Submit behavior?          | MEDIUM   |

### Question Selection for Middle Mode

1. **Must Ask (2-3)**: Component/pattern choice, location, I/O unclear
2. **Should Ask (2-3)**: State handling, edge cases, integration points

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

**Use multiple AskUserQuestion calls if needed (max 4 questions per call).**

For 4-6 questions:

- First call: 3-4 primary questions (component choice, location, I/O, state)
- Second call (if needed): 2 secondary questions (edge cases, integration)

### Example Structure:

```
questions: [
  {
    "question": "어떤 모달 컴포넌트를 사용할까요?",
    "header": "Modal",
    "multiSelect": false,
    "options": [
      {
        "label": "BZWModal",
        "description": "추천: 프로젝트 표준 모달 (WorkspaceActivityDetailDrawer 참고)"
      },
      {
        "label": "BZWDrawer",
        "description": "사이드에서 슬라이드 (필터/설정에 사용)"
      },
      {
        "label": "새 컴포넌트",
        "description": "기존 컴포넌트로 불가능한 경우"
      }
    ]
  },
  {
    "question": "컴포넌트를 어디에 배치할까요?",
    "header": "Location",
    "multiSelect": false,
    "options": [
      {
        "label": "widgets/workspace/",
        "description": "추천: 여러 features 조합 (목록+상세)"
      },
      {
        "label": "features/workspace/ui/",
        "description": "workspace 기능에만 종속"
      },
      {
        "label": "shared/ui/",
        "description": "여러 도메인에서 재사용"
      }
    ]
  },
  {
    "question": "에러 발생 시 어떻게 처리할까요?",
    "header": "Error",
    "multiSelect": false,
    "options": [
      {
        "label": "토스트 메시지",
        "description": "추천: 기존 에러 처리 패턴 (BZWToast)"
      },
      {
        "label": "에러 바운더리",
        "description": "컴포넌트 레벨 에러 처리"
      },
      {
        "label": "인라인 메시지",
        "description": "폼 필드 아래 표시"
      }
    ]
  },
  {
    "question": "로딩 상태를 어떻게 표시할까요?",
    "header": "Loading",
    "multiSelect": false,
    "options": [
      {
        "label": "Skeleton UI",
        "description": "추천: 네트워크 요청 있는 경우 (BZWSkeleton)"
      },
      {
        "label": "Spinner",
        "description": "간단한 로딩 표시"
      },
      {
        "label": "로딩 없음",
        "description": "즉시 표시되는 경우"
      }
    ]
  }
]
```

---

## Phase 4: Generate Refined Specification & Execute /ha

After receiving user answers, create a **concrete specification**:

```
## Refined Specification for /ha

### Original Request
[User's original request]

### Clarified Requirements
- Q1 [Question]: [User's Answer]
- Q2 [Question]: [User's Answer]
- Q3 [Question]: [User's Answer]
- Q4 [Question]: [User's Answer]
- Q5 [Question]: [User's Answer]
- Q6 [Question]: [User's Answer]

### Implementation Directive
[Concrete, unambiguous implementation instructions based on answers]

### Reference Patterns
- [Similar implementation found]: [Brief description of pattern to follow]

### Edge Case Handling
- Error: [How to handle]
- Empty state: [How to handle]
- Loading: [How to handle]
```

Then **automatically invoke /ha command** with this refined specification using the SlashCommand tool:

```
SlashCommand: /ha [Refined Specification]
```

---

## Output Format

````
🔍 요청 분석 중...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 요청 파싱:
- 대상: [Target component/feature]
- 작업: [What needs to be done]
- 컨텍스트: [Related components, patterns, etc.]

🔎 코드베이스 탐색 중...
[Tool calls for exploration]

📎 비슷한 구현 발견:
- [Similar implementation 1]: [Brief pattern description]
  ```typescript
  [3-5 line code snippet showing the pattern]
````

- [Similar implementation 2]: [Brief pattern description]

🔗 인터페이스 분석:

- Input: [Expected input format/type]
- Output: [Expected output format/type]
- Related components: [List of related components]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ Middle 질문 (4-6개)
[AskUserQuestion tool call - first batch]
[AskUserQuestion tool call - second batch if needed]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[After receiving answers]

✅ 명세 구체화 완료

📐 Refined Specification:
[Concrete specification based on answers]

🚀 /ha 실행 중...
[SlashCommand tool call to /ha]

```

---

## Critical Rules

1. **Always search for similar patterns** before asking questions
2. **Always provide recommendations** based on found patterns
3. **Middle = 4-6 questions** - cover component choice, location, I/O, AND edge cases
4. **Auto-execute /ha** after answers - don't ask for confirmation
5. **Never implement code** - only analyze and clarify
6. **Include interface analysis** - understand input/output contracts
7. **Follow FSD architecture** - respect layer boundaries
8. **Prefer existing components** - Use BZW/JDS components before creating new ones
9. **Check CLAUDE.md** - Follow project-specific patterns and prohibited practices
```
