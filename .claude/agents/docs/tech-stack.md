# 기술 스택 레퍼런스

> 모든 에이전트/스킬의 아웃풋은 이 스택 기준으로 생성합니다.

## 버전

| 패키지 | 버전 |
|--------|------|
| React | **19.x** |
| Next.js | **15.x** (App Router) |
| TypeScript | **5.8.x** |
| Tailwind CSS | **3.x** |
| Zustand | 5.x |
| TanStack Query | 5.x |
| React Hook Form | 7.x + Zod |

## 아웃풋 코드 표준

### React 19 기준

```tsx
'use client'; // 인터랙션 있는 컴포넌트 필수

import { useState, useCallback } from 'react'; // React.useState ❌
```

### Tailwind CSS v3 기준

```tsx
// ✅ Tailwind 클래스 사용
<div className="flex flex-col gap-16 p-24">

// ❌ inline style 금지
<div style={{ display: 'flex', gap: '16px' }}>
```

### import 경로

```typescript
// ✅ 직접 파일 경로
import { Button } from '@jds/theme';
import { useJobList } from '@features/job/model/hooks/use-job-list';
import { JobCard } from '@features/job/ui/JobCard';

// ❌ 배럴 파일(index.ts) 금지
import { JobCard } from '@features/job';
```

## 개발 명령어

```bash
pnpm dev              # 개발 서버
pnpm build            # 프로덕션 빌드
pnpm lint             # ESLint
pnpm prettier         # Prettier
pnpm typecheck        # TypeScript 타입 체크
pnpm test             # Vitest 유닛 테스트
pnpm test:e2e         # Playwright E2E
```

## Pre-commit 필수

```bash
pnpm lint && pnpm prettier && pnpm typecheck
```

## 로컬 환경

- Node.js: 22.17.1 (Volta 관리)
- 패키지 매니저: pnpm
- 로컬 호스트: `hiringcenter.local.jobkorea.co.kr`
