# FSD 아키텍처 레퍼런스

> Feature-Sliced Design + DDP 혼합 아키텍처. 파일 위치 결정 시 이 문서 기준.

## 레이어 구조

```
src/
├── app/          → Next.js App Router (pages, layouts)
├── views/        → 페이지 레벨 비즈니스 로직
├── widgets/      → 복합 UI 블록 (여러 features 조합)
├── features/     → 비즈니스 기능 모듈
├── entities/     → 비즈니스 엔티티, 코어 모델
├── core/         → Data Layer (core-data/)
└── shared/       → 공통 리소스 (config, fetch, styles, ui, utils)
```

## 레이어 의존성 규칙

```
shared     → 외부 의존 없음
entities   → shared만
features   → entities + shared
widgets    → features + entities + shared
views      → widgets + features + entities + shared
app        → 모든 레이어
```

**같은 레이어 간 직접 import 금지** → widgets로 조합

## DDP 패턴 (각 레이어 내부)

```
{layer}/{feature}/
├── domain/                 → 순수 비즈니스 로직 (entities, repository, services)
├── model/
│   └── hooks/              → React Query hooks
└── ui/                     → UI 컴포넌트

core/core-data/{feature}/   → Data Layer (dto, mapper, api, repository.impl)
```

## 파일 위치 결정 기준

| 범위 | 레이어 |
|------|--------|
| 페이지 전체 로직 | `views/{feature}/` |
| 여러 feature 조합 UI | `widgets/{feature}/` |
| 단일 비즈니스 기능 | `features/{feature}/` |
| 공통 UI 컴포넌트 | `shared/ui/` |
| 비즈니스 엔티티 | `entities/{name}/` |

## 배럴 파일 금지

```typescript
// ❌ 배럴 파일(index.ts) 금지
import { JobCard } from '@features/job';

// ✅ 직접 파일 경로
import { JobCard } from '@features/job/ui/JobCard';
import { useJobList } from '@features/job/model/hooks/use-job-list';
```

## page.tsx 규칙

`page.tsx`는 얇게 유지 — 데이터 페칭/레이아웃만:

```tsx
// src/app/jobs/page.tsx ✅
import { JobListView } from '@views/job-list/ui/JobListView';
export default function JobsPage() {
  return <JobListView />;
}

// ❌ page.tsx에 UI 로직 금지
export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  return <div className="...">...</div>;
}
```

## 컴포넌트 분리 기준

디자인 레이어에 컴포넌트로 사용된 경우 반드시 분리:

```tsx
// ❌ 한 파일에 모든 것
function JobListView() {
  return (
    <div>
      <div className="header">...</div>  // 분리 필요
      <div className="list">...</div>    // 분리 필요
    </div>
  );
}

// ✅ 컴포넌트 분리
import { JobListHeader } from './JobListHeader';
import { JobListBody } from './JobListBody';
function JobListView() {
  return <div><JobListHeader /><JobListBody /></div>;
}
```
