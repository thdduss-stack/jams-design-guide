---
description: Gemini-style Reasoning + Haiku Implementation - Deep reasoning before action
---

ultrathink.

# /ha - Haiku Assisted Implementation

**Output all responses in Korean.**

## Requirements

$ARGUMENTS

---

## Reasoning Framework (MANDATORY Before Every Action)

Before taking ANY action (tool calls OR responses), you MUST proactively, methodically, and independently reason through:

### 1. Logical Dependencies and Constraints

Analyze the intended action against the following factors. Resolve conflicts in order of importance:

1.1) **Policy-based rules**: Architecture patterns, project conventions, mandatory prerequisites
1.2) **Order of operations**: Ensure taking an action does not prevent a subsequent necessary action

- The user may request actions in random order, but you may need to reorder operations to maximize successful completion
  1.3) **Other prerequisites**: Information and/or actions needed before proceeding
  1.4) **Explicit user constraints**: User's stated preferences or requirements

### 2. Risk Assessment

What are the consequences of taking the action? Will the new state cause any future issues?

- For exploratory tasks (like searches), missing optional parameters is LOW risk
- **Prefer calling tools with available information over asking the user**, unless Rule 1 determines optional information is required for a later step

### 3. Abductive Reasoning and Hypothesis Exploration

At each step, identify the most logical and likely reason for any problem encountered:

- Look beyond immediate or obvious causes - the most likely reason may require deeper inference
- Hypotheses may require additional research - each may take multiple steps to test
- Prioritize hypotheses based on likelihood, but do not discard less likely ones prematurely
- A low-probability event may still be the root cause

### 4. Outcome Evaluation and Adaptability

Does the previous observation require any changes to your plan?

- If initial hypotheses are disproven, actively generate new ones based on gathered information
- Continuously refine your understanding

### 5. Information Availability

Incorporate all applicable and alternative sources of information:

- Using available tools and their capabilities
- All policies, rules, checklists, and constraints
- Previous observations and conversation history
- Information only available by asking the user (last resort)

### 6. Precision and Grounding

Ensure your reasoning is extremely precise and relevant to each exact ongoing situation:

- Verify claims by quoting exact applicable information (including policies) when referring to them
- No vague assumptions - cite specific code, patterns, or documentation

### 7. Completeness

Ensure all requirements, constraints, options, and preferences are exhaustively incorporated:

- Resolve conflicts using the order of importance in #1
- Avoid premature conclusions - there may be multiple relevant options
- Consult the user if uncertain whether something is applicable

### 8. Persistence and Patience

Do not give up unless all reasoning above is exhausted:

- Don't be dissuaded by time taken or complexity
- On transient errors, retry unless explicit limit reached
- On other errors, change strategy - don't repeat failed approaches

### 9. Response Inhibition

**ONLY take action AFTER all the above reasoning is completed. Once you've taken an action, you cannot take it back.**

---

## Phase 1: Exploration and Design (Opus with Deep Reasoning)

### 1-1. Project Architecture Reference

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
│       └── [Widget]/      # Widget component
├── features/               # Business functionality modules
│   └── [domain]/
│       ├── api/           # API call logic (fetch + client)
│       ├── model/         # Business logic (hooks, stores, types)
│       └── ui/            # Feature-specific UI components
├── entities/               # Business entities and core models
└── shared/                 # Common resources
    ├── config/            # Global configuration
    ├── fetch/             # API client setup
    ├── ui/                # Common UI components (BZW*, JDS)
    ├── types/             # Type definitions
    └── utils/             # Utility functions
```

**기술 스택**:

- **Framework**: Next.js 15.4.3 (App Router), React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Vanilla Extract CSS
- **UI**: JDS (JobKorea Design System) + BZW (custom components)
- **State**: Tanstack Query 5.80.7, Zustand 5.0.5
- **Forms**: React Hook Form 7.57.0 + Zod validation
- **Testing**: Vitest + Playwright + Testing Library

**FSD Layer Rules** (CRITICAL):

1. **Dependency Direction**: Lower layers cannot import from higher layers
   - `shared` → no other layer imports
   - `entities` → only `shared`
   - `features` → only `entities`, `shared`
   - `widgets` → only `features`, `entities`, `shared`
   - `views` → only `widgets`, `features`, `entities`, `shared`
   - `app` → can import from all layers

2. **Same Layer Imports**: Features cannot directly import from other features
   - Use `widgets` layer to compose multiple features

3. **File Organization**: Each segment can contain:
   - `api/` - API call logic
   - `model/` - Business logic (hooks, stores, types)
   - `ui/` - UI components
   - `lib/` - Utility functions
   - `config/` - Configuration

### 1-2. Codebase Exploration

#### Tools you can use

| Tool     | Use Case                                    |
| -------- | ------------------------------------------- |
| **Grep** | Text search in files (patterns, keywords)   |
| **Glob** | File path patterns (e.g., `**/*Modal*.tsx`) |
| **Read** | Direct file content                         |
| **Task** | Delegate exploration to specialized agents  |

#### Exploration Strategy

**For component/feature discovery:**

```bash
# Find component usage patterns
Grep: "BZWModal"
Grep: "useQuery"
Glob: "**/*Modal*.tsx"
Glob: "**/use*.ts"
```

**For API patterns:**

```bash
# Find API implementation patterns
Glob: "features/**/api/*.fetch.ts"
Glob: "features/**/api/*.client.ts"
Read: [specific API file]
```

**For form patterns:**

```bash
# Find form implementation patterns
Grep: "useForm"
Grep: "zodResolver"
Glob: "**/*Form*.tsx"
```

### 1-3. Common Patterns Reference

**Component Patterns:**

- **BZW Components**: `src/shared/ui/BZW*/` (BZWButton, BZWModal, BZWDrawer, BZWDataTable, etc.)
- **JDS Components**: `@jds/theme` (Icon, TextButtonUnderline, etc.)
- **File structure**: PascalCase folders with `index.tsx`

**API Patterns:**

- **Fetch layer**: `features/*/api/[feature].fetch.ts`
  - Export async functions
  - Use `workspaceAuthFetch()` or other fetch clients
  - Return typed response data
- **Client layer**: `features/*/api/[feature].client.ts`
  - Export Tanstack Query hooks (`useQuery`, `useMutation`, `useInfiniteQuery`)
  - Import from `.fetch.ts`
  - Define query keys

**State Management:**

- **Local state**: `useState`, `useReducer` in components
- **Global state**: Zustand stores in `features/*/model/`
- **Server state**: Tanstack Query

**Forms:**

- **Pattern**: React Hook Form + Zod schema
- **Location**: `features/*/ui/` or `widgets/*/`
- **Validation**: Zod schemas in same file or `model/`

**Types:**

- **API types**: `src/shared/types/api/[service]/`
- **Feature types**: `features/*/model/[feature].types.ts`
- **Entity types**: `entities/[entity]/model/`

### 1-4. Reasoning Verification Checklist

**Before writing the design document, verify ALL items:**

- [ ] **Logical Dependencies**: Does the implementation order respect all dependencies?
- [ ] **Risk Assessment**: Does this design avoid breaking existing functionality?
- [ ] **Hypothesis Validation**: Is codebase analysis sufficient?
- [ ] **Information Completeness**: Are there any missing requirements?
- [ ] **Precision**: Have I cited specific code/patterns as evidence?
- [ ] **Adaptability**: Have I considered alternative approaches?
- [ ] **FSD Compliance**: Does this follow FSD layer rules?

### 1-5. Design Document

```
## Design Document

### Requirements
- Core functionality: [What to implement]
- Scope of impact: [Which files are affected]
- Constraints: [Architecture/convention requirements to follow]

### Reasoning Evidence
- Current codebase analysis: [Patterns discovered in existing code]
- Similar implementations: [References to similar features]
- Dependency analysis: [Required dependencies and their order]
- Alternative approaches considered: [Why this approach was chosen]

### File-by-File Implementation Spec

#### [File Path 1]
- Purpose: [What this file does]
- Layer: [FSD layer - app/views/widgets/features/entities/shared]
- Implementation: [Detailed implementation with types]
- Dependencies: [What this file depends on]
- Exports: [What this file exports]

#### [File Path 2]
- Purpose: [What this file does]
- Layer: [FSD layer]
- Implementation: [Detailed implementation with types]
- Dependencies: [What this file depends on]
- Exports: [What this file exports]

### Implementation Order (Dependency-Based)
1. [First file] - Reason: [Why first]
2. [Second file] - Reason: [Why next]
3. [Third file] - Reason: [Why third]

### Risk Factors and Mitigation
- [Potential risk]: [Mitigation strategy]

### Type Safety
- [Type definitions needed]
- [Interface definitions]

### Testing Strategy
- Unit tests: [What to test]
- Component tests: [What to test]
- E2E tests: [What to test]
```

**Design Principles:**

- Specific enough for Haiku to implement without additional reasoning
- No ambiguous expressions ("appropriately" → "return empty list if null")
- **Every decision must include evidence** (why this approach)
- **No `any` type** - define proper interfaces
- **Prefer existing components** - BZW/JDS before creating new ones

---

## Phase 2: Haiku Implementation (Task Tool)

### Task Tool Invocation

```
Task tool parameters:
- subagent_type: "general-purpose"
- model: "haiku"
- prompt: (use template below)
```

### Haiku Prompt Template

````
# Code Implementation Directive

You are responsible for code implementation only. Write code exactly as designed.

## Project Info
- Path: /Users/kimseungmi/Documents/member/jk-bizcenter-fe-web
- Framework: Next.js 15.4.3 (App Router), React 19.1.0
- Language: TypeScript 5.8.3

## Architecture: Feature-Sliced Design (FSD)

### Layer Rules (CRITICAL)
1. Lower layers cannot import from higher layers
2. Features cannot import from other features (use widgets)
3. Follow strict layer boundaries

### Component Patterns

**BZW Components** (src/shared/ui/BZW*/):
- BZWButton: Solid, outlined, borderless variants
- BZWModal: Standard modal with header/body/footer
- BZWDrawer: Side panel with compound components
- BZWDataTable: AG Grid based data table
- BZWToast: Toast notifications
- BZWSkeleton: Loading skeleton

**JDS Components** (@jds/theme):
- Icon: Icon components
- TextButtonUnderline: Underlined text button
- And other JDS design system components

### API Patterns

**Fetch Layer** (features/*/api/[feature].fetch.ts):
```typescript
import { workspaceAuthFetch } from '@shared/fetch/fetch-workspace-auth';

export async function getFeatureData(id: string): Promise<ResponseType> {
  const httpClient = workspaceAuthFetch();
  const response = await httpClient.get<ResponseType>(`/v1/path/${id}`);
  return response.data;
}
````

**Client Layer** (features/\*/api/[feature].client.ts):

```typescript
import { QUERY_KEY } from '@shared/fetch/query-keys';
import { useQuery } from '@tanstack/react-query';
import { getFeatureData } from './[feature].fetch';

export function useFeatureQuery(id: string) {
  return useQuery({
    queryKey: QUERY_KEY({ id }),
    queryFn: () => getFeatureData(id),
  });
}
```

### Form Patterns

**React Hook Form + Zod:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    // Handle submit
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Prohibited Patterns (from CLAUDE.md)

**Never use:**

- `any` type → define proper interfaces
- Inline styles → use component props or Vanilla Extract
- `margin`/`padding` in layout → use `gap`
- `React.useState` → import `useState` directly
- Inline functions → define handler functions
- External CDN dependencies → use local assets
- Missing image alt text

### File Naming Conventions

- **Components**: PascalCase folders with `index.tsx`
- **Hooks**: `use[Feature].ts` in `model/` segments
- **Server Components**: `index.server.ts`
- **Types**: `[feature].types.ts`
- **Tests**: `[feature].test.ts`

## Implementation Content

[Paste "File-by-File Implementation Spec" section from design document here]

## Implementation Order

1. [File1] - [Reason]
2. [File2] - [Reason]
3. [File3] - [Reason]

## Verification Steps

After implementation:

1. Check TypeScript errors: Use Read tool to verify no type errors
2. Verify imports follow FSD layer rules
3. Verify no prohibited patterns used
4. Check file naming conventions

Output "Implementation Complete" after all files are done and verified.

````

---

## Phase 3: Verification (Opus)

After Haiku completes:

### 3-1. Code Review
- Review created/modified files
- Check type safety (no `any` types)
- Verify FSD layer compliance
- Check prohibited patterns

### 3-2. Run Checks
```bash
# TypeScript type checking
pnpm typecheck

# Linting
pnpm lint

# Tests (if applicable)
pnpm test
````

### 3-3. Fix Issues

- If issues found, fix directly or re-delegate to Haiku
- Ensure all checks pass before completion

---

## Output Format

````
🧠 Deep Reasoning Phase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Logical Dependencies Analysis:
[Analysis result]

⚠️ Risk Assessment:
[Analysis result]

🔬 Hypothesis Exploration:
[Hypotheses and validation approach]

📚 Information Sources Used:
[Tools, policies, history referenced]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Codebase Analysis...
[Exploration results with specific file/pattern references]

📎 Similar Patterns Found:
- [Pattern 1]: [File path and description]
  ```typescript
  [Code snippet]
````

- [Pattern 2]: [File path and description]

✅ Reasoning Checklist Verified

- [x] Logical dependencies confirmed
- [x] Risk assessment complete
- [x] Hypothesis validation complete
- [x] Information completeness confirmed
- [x] Precision ensured
- [x] Adaptability considered
- [x] FSD compliance verified

📐 Design Document...
[Design document with reasoning evidence]

🚀 Delegating to Haiku...
[Task tool invocation]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Implementation Complete!

- Files created: N
- Files modified: N
- Type check: [Result]
- Lint check: [Result]
- Tests: [Result]

```

---

## Critical Rules

1. **Deep reasoning first** - Complete all reasoning before any action
2. **Evidence-based design** - Every decision must cite specific code/patterns
3. **Type safety** - Never use `any`, define proper interfaces
4. **FSD compliance** - Strictly follow layer boundaries
5. **Component reuse** - Prefer BZW/JDS components before creating new
6. **Follow CLAUDE.md** - Respect all project-specific patterns and prohibitions
7. **Comprehensive verification** - Run typecheck, lint, tests
8. **No shortcuts** - Complete all phases, don't skip verification
```
