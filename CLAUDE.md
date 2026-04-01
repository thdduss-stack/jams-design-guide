# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Figma Dev Mode MCP 규칙

- **중요**: Figma MCP Server가 localhost 소스를 반환하면 해당 소스를 직접 사용하세요
- **중요**: 새로운 아이콘 패키지를 설치하지 마세요. Icon은 @jds/theme에 Icon 컴포넌트를 사용합니다.
- **중요**: emoji 컴포넌트의 경우 @jk/react-share의 emoji 컴포넌트를 사용합니다.
- **중요**: localhost 소스가 있으면 플레이스홀더를 만들지 마세요
- Figma 디자인의 색상값, 간격, 폰트 크기를 정확히 추출해서 사용하세요

package.json 파일의 의존성을 확인하세요.

- **프레임워크**: Next.js 15+, TypeScript, React.js 18+
- **스타일링**: tailwindcss@3 (안정 버전)
- **상태관리**: React hooks (useState, useEffect 등)

# 금지 패턴

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

## Commands

### Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Build with bundle analysis
pnpm build-analyze

# Start production build locally
pnpm build-dev
```

### Testing

```bash
# Run unit tests with Vitest
pnpm test

# Run unit tests with coverage
pnpm test:coverage

# Run filtered unit tests with coverage
pnpm test:coverage:filter

# Run unit tests with UI
pnpm test:unit:ui

# Run unit tests in watch mode
pnpm test:unit:watch

# Run E2E tests with Playwright
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui

# Run performance tests with K6
pnpm test:k6
```

### Code Quality

```bash
# Run ESLint with auto-fix
pnpm lint

# Format code with Prettier
pnpm prettier

# Run TypeScript type checking
pnpm typecheck

# Run SonarQube analysis
pnpm sonar
```

### Development Tools

```bash
# Generate CSS for SVG icons
pnpm bz:create-svg-css

# Fetch API schemas
pnpm fetch-schema

# Generate Zod schemas
pnpm generate-zod

# SSL certificate setup
pnpm cert

# Clean install dependencies
pnpm clear-install
```

## Project Structure

This project follows **FSD + DDP 혼합 아키텍처**:

### FSD (Feature-Sliced Design) 레이어

```
src/
├── app/                    # Next.js App Router pages and layouts
├── views/                  # Page-level business logic (FSD Pages layer)
├── widgets/                # Composite UI blocks combining multiple features
├── features/               # Business functionality modules
├── entities/               # Business entities and core models
└── shared/                 # Common resources used across all layers
    ├── config/            # Global configuration
    ├── fetch/             # API client setup
    ├── styles/            # Global styles
    ├── types/             # Common type definitions
    ├── ui/                # Common UI components
    └── utils/             # Utility functions
```

### DDP (Data-Domain-Presentation) 레이어

FSD의 모든 레이어(`features`, `views`, `widgets`, `entities`)에서 DDP 패턴 적용 가능:

```
src/
├── core/
│   └── core-data/[feature-name]/   # Data Layer (분리됨)
│       ├── dto.ts                  # API 응답/요청 DTO 타입
│       ├── mapper.ts               # DTO ↔ Entity 변환
│       ├── api.ts                  # API 호출 함수
│       └── repository.impl.ts      # Repository 인터페이스 구현
│
└── {layer}/[feature-name]/         # layer = features, views, widgets, entities 등
    ├── domain/                     # Domain Layer - 비즈니스 로직
    │   ├── entities.ts             # 도메인 엔티티 (불변 객체)
    │   ├── repository.ts           # Repository 인터페이스 (추상화)
    │   └── services.ts             # 비즈니스 로직 서비스
    ├── model/                      # Presentation Hooks
    │   └── hooks/                  # React Query hooks
    └── ui/                         # UI 컴포넌트
```

## Architecture

### Tech Stack

- **Framework**: Next.js 15.4.3 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS (Vanilla Extract에서 전환 중)
- **UI Components**: JDS (JobKorea Design System) + Custom BZW components
- **Data Fetching**: Tanstack Query 5.80.7
- **Forms**: React Hook Form 7.57.0 + Zod validation
- **State Management**: Zustand 5.0.5
- **Testing**: Vitest + Playwright + Testing Library
- **Build**: Standalone output with Bundle Analyzer support

### FSD Layer Rules

1. **Dependency Direction**: Lower layers cannot import from higher layers
   - `shared` → no other layer imports allowed
   - `entities` → can import from `shared` only
   - `features` → can import from `entities` and `shared`
   - `widgets` → can import from `features`, `entities`, and `shared`

2. **Same Layer Imports**: Features cannot directly import from other features
   - Use `widgets` layer to compose multiple features

### DDP Layer Rules

1. **의존성 방향**: Domain → Data (역방향 금지)
   - `domain/` → 외부 의존성 없음 (순수 비즈니스 로직)
   - `core-data/` → `domain/`의 인터페이스 구현
   - `model/hooks/` → `domain/`의 서비스와 엔티티 + `core-data/`의 repository 사용

2. **Repository 패턴**:
   - `{layer}/[feature]/domain/repository.ts` → 추상 인터페이스 정의
   - `core/core-data/[feature]/repository.impl.ts` → 실제 API 호출 구현
   - 테스트 시 Mock Repository로 교체 가능

3. **Mapper 규칙**:
   - API 응답(DTO) ↔ 도메인 엔티티 변환은 `core-data/[feature]/mapper.ts`에서만
   - UI 레이어는 도메인 엔티티만 사용

4. **Import 규칙** (배럴 파일 사용 금지):
   - 각 파일에서 직접 export하고, import 시 직접 파일 경로 사용
   - 엔티티: `@{layer}/[feature]/domain/entities`
   - 인터페이스: `@{layer}/[feature]/domain/repository`
   - 서비스: `@{layer}/[feature]/domain/services`
   - Repository 구현체: `@core/core-data/[feature]/repository.impl`
   - Hooks: `@{layer}/[feature]/model/hooks/use-[name]`

### Styling 전환 가이드라인

1. **신규 코드**: Tailwind CSS 사용 필수
2. **기존 Vanilla Extract 코드**: 해당 파일 수정 시 점진적으로 Tailwind로 전환
3. **Tailwind 설정**: `tailwind.config.mjs`에서 JDS 디자인 토큰 사용
   - 색상: `text-gray-500`, `bg-blue-100` 등
   - 간격: `gap-8`, `p-16` 등 (숫자는 px 값)
   - 폰트: `text-14`, `font-semibold` 등

4. **Tailwind 커스텀 설정 주의사항** (기본값과 다름):
   - `borderRadius`: 커스텀 스케일 사용 → `rounded-full` 대신 **`rounded-999`** 사용
     - 사용 가능: `rounded-0`, `rounded-2`, `rounded-4`, `rounded-6`, `rounded-8`, `rounded-12`, `rounded-16`, `rounded-20`, `rounded-24`, `rounded-999`
   - `spacing`: px 기반 스케일 사용 → `gap-4`는 4px (Tailwind 기본 16px 아님)
   - `colors`: JDS 팔레트 사용 → `bg-base-white`, `text-gray-900` 등

5. **File Organization**: Each layer segment can contain:
   - `api/` - API call logic
   - `model/` - Business logic (hooks, stores, types)
   - `ui/` - UI components
   - `lib/` - Utility functions
   - `config/` - Configuration

### File Naming Conventions

- **Components**: PascalCase folders with `index.tsx`
- **Hooks**: `use[Feature]` pattern in `model/` segments
- **Server Components**: `index.server.ts`
- **Types**: `[feature].types.ts`
- **Tests**: `[feature].test.ts`

## Key Features

### Business Domains

- **Workspace Management**: Multi-tenant workspace creation and management
- **Applicant Management**: Job application tracking and recruitment workflows
- **Job Posting**: Job posting creation and management
- **Payment System**: SmartFit and advertising payment processing
- **Authorization**: Role-based access control

### Custom UI System

- **BZW Components**: Custom design system components (BZWButton, BZWModal, etc.)
- **Icons**: SVG icon system with automatic CSS generation
- **Responsive Design**: Mobile-first approach

### Development Features

- **Hot Reload**: Development server with fast refresh
- **Bundle Analysis**: Build analysis with @next/bundle-analyzer
- **Error Monitoring**: Sentry integration
- **Performance Monitoring**: OpenTelemetry instrumentation
- **PDF Handling**: react-pdf integration for document viewing

## Environment Setup

### Prerequisites

- Node.js 22.17.1 (managed with Volta)
- pnpm package manager
- SSL certificate setup for local development

### SSL Certificate

```bash
# Install mkcert
brew install mkcert

# Generate certificates
pnpm cert
```

### Host Configuration

Add to `/etc/hosts`:

```
127.0.0.1 hiringcenter.local.jobkorea.co.kr
```

## Testing Strategy

- **Unit Tests**: Vitest with coverage reporting
- **Integration Tests**: React Testing Library
- **E2E Tests**: Playwright with test groups
- **Performance Tests**: K6 for browser flow testing
- **Visual Regression**: Included in E2E test suite

## Code Quality

### Linting & Formatting

- **ESLint**: @jds/config-eslint (company standard)
- **Prettier**: @jds/config-prettier
- **TypeScript**: @jds/config-typescript
- **Git Hooks**: Husky + lint-staged

### Pre-Commit Checklist

**코드를 커밋하기 전에 반드시 다음 체크리스트를 확인하세요:**

1. **ESLint 검사**
   ```bash
   pnpm lint
   ```
   - 모든 lint 에러 수정 필수
   - 경고는 가능하면 수정

2. **Prettier 포맷팅**
   ```bash
   pnpm prettier
   ```
   - 코드 포맷 자동 정리

3. **TypeScript 타입 체크**
   ```bash
   pnpm typecheck
   ```
   - 타입 에러 0개 확인 필수
   - `any` 타입 사용 금지

4. **전체 체크 (한 번에 실행)**
   ```bash
   pnpm lint && pnpm prettier && pnpm typecheck
   ```

**✅ 모든 체크가 통과한 후에만 커밋하세요!**

### Commit Convention

```
type: Subject

body (optional)

footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `modify`, `refactor`, `test`, `chore`, `remove`, `rename`

## Deployment

- **Build Output**: Standalone for containerized deployment
- **Bundle Analysis**: Available via `pnpm build-analyze`
- **Source Maps**: Enabled for production debugging
- **Docker**: Dockerfile.local for local container testing

## Active Technologies

- TypeScript 5.8.3, Node.js 22.17.1 (Volta 관리) (001-company-api-integration)

- TypeScript 5.8.3, React 19.1.0, Next.js 15.4.3 (002-ai-job-posting-upload)
- N/A (클라이언트 사이드 상태 관리만 사용) (002-ai-job-posting-upload)

- TypeScript 5.8.3, Node.js 22.17.1 (001-imgraph-file-upload)
- S3 (via ImgraphSDK Pre-Signed URLs) (001-imgraph-file-upload)

## Recent Changes

- 001-imgraph-file-upload: Added TypeScript 5.8.3, Node.js 22.17.1
