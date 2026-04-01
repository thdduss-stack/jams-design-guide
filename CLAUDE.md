# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**디자이너가 Claude로 콘텐츠를 만들어 공유하는 프로젝트**입니다.
Figma 디자인을 Claude를 통해 바로 코드로 변환하며, 디자인-코드 간 일관성을 자동화합니다.

---

## Figma Dev Mode MCP 규칙

- **중요**: Figma MCP Server가 localhost 소스를 반환하면 해당 소스를 직접 사용하세요
- **중요**: 새로운 아이콘 패키지를 설치하지 마세요. Icon은 @jds/theme에 Icon 컴포넌트를 사용합니다.
- **중요**: emoji 컴포넌트의 경우 @jk/react-share의 emoji 컴포넌트를 사용합니다.
- **중요**: localhost 소스가 있으면 플레이스홀더를 만들지 마세요
- Figma 디자인의 색상값, 간격, 폰트 크기를 정확히 추출해서 사용하세요

## Tech Stack

- **프레임워크**: Next.js 15+ (App Router), TypeScript 5.8, React 19+
- **스타일링**: Tailwind CSS 3 (Vanilla Extract에서 전환 중)
- **상태관리**: Zustand 5, React hooks
- **데이터**: Tanstack Query 5, React Hook Form 7 + Zod
- **UI**: JDS (JobKorea Design System) + BZW 커스텀 컴포넌트
- **테스트**: Vitest + Playwright + Testing Library

---

## Claude Skills & Agents

### 스킬 (`.claude/skills/`)

디자인-코드 변환 워크플로우를 위한 전문 스킬들:

| 스킬 | 설명 | 트리거 |
|------|------|--------|
| [figma-to-component](.claude/skills/figma-to-component/SKILL.md) | Figma 디자인 → React 컴포넌트 자동 생성 (Tailwind 전용) | Figma URL 제공 시 |
| [figma-to-markdown](.claude/skills/figma-to-markdown/SKILL.md) | Figma 기획서 → UI 로직 마크다운 문서 변환 | `/figma-to-markdown` |
| [figma-design-tokens-to-tailwind](.claude/skills/figma-design-tokens-to-tailwind/SKILL.md) | Figma 디자인 토큰 → Tailwind Config 자동 변환 | 디자인 토큰 변환 요청 시 |
| [design-review](.claude/skills/design-review/SKILL.md) | Figma 디자인 vs 구현 시각적/토큰 검수 | `/design-review` |
| [icon-mapper](.claude/skills/icon-mapper/SKILL.md) | Figma 아이콘 → 프로젝트 아이콘 매핑 | figma-to-component에서 자동 호출 |

### 에이전트 (`.claude/agents/`)

| 에이전트 | 설명 |
|----------|------|
| [icon-mapper](.claude/agents/icon-mapper.md) | Figma 아이콘을 BZWIcon / @jds/theme Icon으로 매핑 |
| [jams-tailwind-config](.claude/agents/jams-tailwind-config.md) | design-tokens.css → tailwind.config.mjs 자동 생성 |

### 커맨드 (`.claude/commands/`)

| 커맨드 | 설명 |
|--------|------|
| `/ha` | Gemini-style Reasoning + Haiku 구현 |
| `/haq` | Haiku Assisted Question (2-3개 질문 후 /ha) |
| `/haqq` | Haiku Assisted Question (4-6개 질문 후 /ha) |
| `/haqqq` | Haiku Assisted Question (7-10개 질문 후 /ha) |

---

## 디자인 가이드

디자인 원칙과 규격은 [docs/policy/design-guide.md](docs/policy/design-guide.md)를 참조하세요.

핵심 요약:
- **테마**: 잡코리아(파랑 Primary) / 알바몬(주황 Primary) 듀얼 브랜드
- **데스크톱 전용**: 최소 1216px ~ 최대 1856px
- **폰트**: Pretendard
- **색상**: 역할 기반 색상 사용 (HEX 직접 사용 지양)

---

## Tailwind 설정 (`tailwind.config.mjs`)

### 커스텀 설정 주의사항 (기본 Tailwind와 다름)

1. **spacing**: px 기반 스케일 → `gap-4`는 **4px** (Tailwind 기본 16px 아님)
   - 사용 가능: `0`, `2`, `4`, `6`, `8`, `10`, `12`, `13`, `14`, `16`, `20`, `24`, `28`, `32`, `40`, `48`, `52`, `56`, `60`, `72`, `80`, `-1`, `-2`, `-12`

2. **borderRadius**: 커스텀 스케일 → `rounded-full` 대신 **`rounded-999`** 사용
   - 사용 가능: `rounded-0`, `rounded-2`, `rounded-4`, `rounded-6`, `rounded-8`, `rounded-12`, `rounded-16`, `rounded-20`, `rounded-24`, `rounded-999`

3. **fontSize**: 숫자 스케일 → `text-14`는 14px (lineHeight, letterSpacing 자동 연동)
   - 사용 가능: `text-11` ~ `text-36` (11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36)

4. **fontWeight**: 커스텀 이름
   - `font-regular`(400), `font-medium`(500), `font-semibold`(600), `font-bold`(700)

5. **colors**: JDS CSS 변수 기반 팔레트
   - 기본: `base-black`, `base-white`, `base-dimed`
   - 팔레트: `gray`, `blue`, `orange`, `red`, `green`, `yellow`, `bluegray`, `violet`, `purple`, `pink`, `indigo`, `brown`, `olive`, `mint`
   - 시멘틱: `button`, `line`, `typography`, `icon`, `box`, `checkbox`, `radio`, `tabs`, `tag` 등

---

## 금지 패턴

- `any` 타입 사용 금지 → 명확한 interface 정의
- inline style 금지 → 우선적으로 컴포넌트 props사용 후 안될경우 Tailwind 클래스 사용
- margin/padding 대신 gap 사용 (레이아웃에서)
- 디자인 레이어에 컴포넌트로 사용했을 경우 분리
- `React.useState` → `useState`로 직접 import
- inline function → handler 함수 분리 (handleButtonClick 등)
- 외부 CDN 의존성 → 로컬 assets 사용
- 이미지 alt 텍스트 누락 금지
- **배럴 파일(index.ts) 사용 금지** → 각 파일에서 직접 export, import 시 직접 파일 경로 사용
  - ❌ `import { Company } from '@core/domain/company'`
  - ✅ `import { Company } from '@core/domain/company/entities'`

---

## Commands

### Development

```bash
pnpm dev              # 개발 서버 실행
pnpm build            # 프로덕션 빌드
pnpm build-analyze    # 번들 분석 빌드
```

### Code Quality

```bash
pnpm lint             # ESLint
pnpm prettier         # Prettier 포맷팅
pnpm typecheck        # TypeScript 타입 체크
pnpm lint && pnpm prettier && pnpm typecheck  # 전체 체크
```

### Testing

```bash
pnpm test             # 유닛 테스트 (Vitest)
pnpm test:e2e         # E2E 테스트 (Playwright)
```

---

## Project Structure

**FSD + DDP 혼합 아키텍처**:

```
src/
├── app/                    # Next.js App Router (pages, layouts)
├── views/                  # 페이지 레벨 비즈니스 로직
├── widgets/                # 복합 UI 블록 (여러 features 조합)
├── features/               # 비즈니스 기능 모듈
├── entities/               # 비즈니스 엔티티, 코어 모델
├── core/                   # Data Layer (core-data/)
└── shared/                 # 공통 리소스 (config, fetch, styles, ui, utils)
```

### DDP 패턴 (각 레이어 내부)

```
{layer}/[feature]/
├── domain/                 # 순수 비즈니스 로직 (entities, repository, services)
├── model/hooks/            # React Query hooks
└── ui/                     # UI 컴포넌트

core/core-data/[feature]/   # Data Layer (dto, mapper, api, repository.impl)
```

### FSD Layer Rules

- `shared` → 외부 의존 없음
- `entities` → `shared`만 import
- `features` → `entities` + `shared`
- `widgets` → `features` + `entities` + `shared`
- **같은 레이어 간 직접 import 금지** → `widgets`로 조합

### Styling 규칙

- **신규 코드**: Tailwind CSS 필수
- **기존 Vanilla Extract**: 수정 시 점진적 Tailwind 전환

---

## Pre-Commit Checklist

```bash
pnpm lint && pnpm prettier && pnpm typecheck
```

모든 체크 통과 후에만 커밋하세요.

### Commit Convention

`type: Subject` — Types: `feat`, `fix`, `docs`, `style`, `modify`, `refactor`, `test`, `chore`, `remove`, `rename`

---

## Environment Setup

- **Node.js**: 22.17.1 (Volta 관리)
- **패키지 매니저**: pnpm
- **로컬 호스트**: `127.0.0.1 hiringcenter.local.jobkorea.co.kr` (`/etc/hosts`에 추가)
- **SSL**: `brew install mkcert && pnpm cert`
