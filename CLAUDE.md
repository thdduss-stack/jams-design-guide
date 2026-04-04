# CLAUDE.md

> 이 프로젝트는 **디자이너가 Claude로 콘텐츠를 만들어 공유하는 프로젝트**입니다.
> Figma 디자인을 Claude를 통해 바로 코드로 변환하며, 디자인-코드 간 일관성을 자동화합니다.

---

## 참조 문서

| 문서 | 경로 | 내용 |
|------|------|------|
| 디자인 시스템 | `.claude/docs/design-system.md` | JDS + BizJAMS 토큰, 컴포넌트, QA 체크리스트 |
| 기술 스택 | `.claude/docs/tech-stack.md` | React 19, Next.js 15, Tailwind v3, 명령어 |
| 코딩 컨벤션 | `.claude/docs/coding-conventions.md` | 금지 패턴, 커밋 컨벤션 |
| 아키텍처 | `.claude/docs/architecture.md` | FSD + DDP 구조, 레이어 규칙 |
| 컴포넌트 | `.claude/docs/components.md` | BZW 커스텀 컴포넌트 레퍼런스 |
| 디자인 패턴 | `.claude/docs/design-patterns.md` | 페이지 템플릿, 레이아웃 패턴 |
| 비즈센터 홈 스펙 | `.claude/agents/docs/bizcenter-home-spec.md` | 기능 정의서 (케이스별) |
| 비즈센터 홈 디자인 | `.claude/agents/docs/bizcenter-home-design.md` | 컴포넌트 스펙 + Mock 데이터 |
| 디자인 가이드 | `docs/policy/design-guide.md` | 사람(디자이너/개발자)용 가이드북 |
| 레슨런 | `.claude/docs/lessons-learned.md` | 대화 중 발견한 규칙/실수/개선 누적 기록 |

---

## 핵심 규칙 요약

### PRD 수신 시 워크플로우 (필수)
- PRD → 코드 직행 **금지**
- 순서: PRD → **Figma 디자인 먼저 생성** → 사용자에게 제안 → 승인 → 코드 변환
- Figma rate limit 상태면 명시적으로 알리고 대기

### Figma Dev Mode MCP
- Figma MCP Server가 localhost 소스를 반환하면 해당 소스를 직접 사용
- 새로운 아이콘 패키지 설치 금지 → `BZWIcon` / `@jds/theme Icon` 사용
- localhost 소스가 있으면 플레이스홀더 만들지 말 것
- emoji 컴포넌트: `@jk/react-share`의 emoji 컴포넌트 사용

### 스타일 규칙
- **신규 코드**: Tailwind CSS 필수 (기존 Vanilla Extract는 점진적 전환)
- `gap-4` = **4px** (기본 Tailwind 16px 아님)
- `rounded-999` 사용 (`rounded-full` 금지)
- inline style 금지 → Tailwind 클래스 또는 컴포넌트 props 사용

### 폼 요소
- HTML 네이티브 `<button>`, `<input>`, `<select>` 직접 사용 금지
- 반드시 `@jds/theme` 컴포넌트 사용

### 코드 품질
- `any` 타입 금지
- 배럴 파일(index.ts) 사용 금지 → 직접 파일 경로 import
- `React.useState` 금지 → `useState` 직접 import
- inline function 금지 → `handleXxx` 분리

---

## 프로젝트 구조

```
src/
├── app/          # Next.js App Router
├── views/        # 페이지 레벨 비즈니스 로직
├── widgets/      # 복합 UI 블록
├── features/     # 비즈니스 기능 모듈
├── entities/     # 비즈니스 엔티티
├── core/         # Data Layer
└── shared/       # 공통 리소스
```

---

## 스킬 & 에이전트

### 스킬 (`.claude/skills/`)

| 스킬 | 트리거 |
|------|--------|
| `figma-to-component` | Figma URL 제공 시 |
| `figma-to-markdown` | `/figma-to-markdown` |
| `figma-design-tokens-to-tailwind` | 디자인 토큰 변환 요청 시 |
| `design-review` | `/design-review` |
| `design-from-description` | "화면 만들어", "UI 만들어줘" 등 |
| `icon-mapper` | figma-to-component에서 자동 호출 |

### 에이전트 (`.claude/agents/`)

| 에이전트 | 역할 |
|----------|------|
| `design-to-code` | Figma → React 컴포넌트 변환 |
| `design-from-description` | 텍스트 설명 → UI 생성 |
| `designer-systematic` | JDS 100% 준수 페르소나 |
| `designer-creative` | 창의적 판단 추가 페르소나 |
| `pm-lead` | PRD 작성 (Cast) |
| `spec-writer` | 상세 스펙 문서 작성 |
| `mock-generator` | Mock 데이터 생성 |
| `qa-checker` | JDS 규칙 + 코드 품질 검증 |
| `shipper` | 커밋 → PR 생성 |
| `full-cycle` | Cast → Spell → Build 전체 파이프라인 |

### 커맨드 (`.claude/commands/`)

| 커맨드 | 설명 |
|--------|------|
| `/ha` | Gemini-style Reasoning + Haiku 구현 |
| `/haq` | 2-3개 질문 후 /ha |
| `/haqq` | 4-6개 질문 후 /ha |
| `/haqqq` | 7-10개 질문 후 /ha |

---

## 환경 설정

- **Node.js**: 22.17.1 (Volta 관리)
- **패키지 매니저**: pnpm
- **로컬 호스트**: `127.0.0.1 hiringcenter.local.jobkorea.co.kr` (`/etc/hosts`에 추가)
- **SSL**: `brew install mkcert && pnpm cert`

```bash
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드
pnpm lint && pnpm prettier && pnpm typecheck  # 커밋 전 필수
```
