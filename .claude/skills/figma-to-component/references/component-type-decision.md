# 컴포넌트 유형 결정 기준

Figma 디자인을 분석한 후 컴포넌트를 어떤 유형으로 분류할지 결정하는 기준입니다.

## 컴포넌트 유형 개요

| 유형          | 배치 경로                    | 특징                       |
| ------------- | ---------------------------- | -------------------------- |
| **기능 UI**   | `src/features/{feature}/ui/` | 특정 기능에 강하게 결합    |
| **엔티티 UI** | `src/entities/{entity}/ui/`  | 도메인 엔티티 표현         |
| **공용 UI**   | `src/shared/ui/`             | 도메인 독립적, 전역 재사용 |
| **뷰**        | `src/views/{domain}/`        | 페이지 레벨 컴포넌트       |
| **위젯**      | `src/widgets/{domain}/`      | 여러 기능/엔티티 조합      |

## 유형별 상세 기준

### 1. 공용 UI (Shared UI)

**배치 경로:** `src/shared/ui/`

**판단 기준:**

- ✅ 도메인 지식 없이 사용 가능
- ✅ 프로젝트 전체에서 재사용
- ✅ Props만으로 동작 (외부 상태 의존 없음)

**예시:**

- Button, Input, Modal, Badge, Tooltip
- LoadingSpinner, Skeleton, ErrorBoundary
- Pagination, Table, Tabs

**코드 특징:**

```tsx
// ✅ 공용 UI - 도메인 독립적
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

### 2. 엔티티 UI (Entity UI)

**배치 경로:** `src/entities/{entity}/ui/`

**판단 기준:**

- ✅ 특정 도메인 엔티티를 시각적으로 표현
- ✅ 엔티티 타입에 의존
- ✅ 여러 Feature에서 재사용 가능

**예시:**

- `entities/applicants/ui/`: ApplicantCard, ApplicantAvatar, ApplicantStatus
- `entities/job-posting/ui/`: JobPostingItem, JobPostingBadge
- `entities/workspace/ui/`: WorkspaceCard, MemberAvatar

**코드 특징:**

```tsx
// ✅ 엔티티 UI - 도메인 엔티티 타입 사용
import { Applicant } from '../domain/entities';

interface ApplicantCardProps {
  applicant: Applicant; // 도메인 엔티티 의존
  onClick?: () => void;
}
```

---

### 3. 기능 UI (Feature UI)

**배치 경로:** `src/features/{feature}/ui/`

**판단 기준:**

- ✅ 특정 비즈니스 기능에 강하게 결합
- ✅ Feature의 Model(Hook)을 직접 사용
- ✅ 해당 Feature 외부에서 재사용 불가

**예시:**

- `features/applicants/ui/`: ApplicantFilter, ApplicantSearchForm, ApplicantBulkActions
- `features/job-posting/ui/`: JobPostingEditor, PostingPreview
- `features/payments/ui/`: PaymentForm, PaymentSummary

**코드 특징:**

```tsx
// ✅ 기능 UI - Feature의 Hook 사용
import { useApplicantFilter } from '../model/hooks/useApplicantFilter';

const ApplicantFilter = () => {
  const { filters, updateFilter, resetFilters } = useApplicantFilter();
  // Feature에 강하게 결합된 로직
};
```

---

### 4. 뷰 (View)

**배치 경로:** `src/views/{domain}/`

**판단 기준:**

- ✅ 페이지 레벨 컴포넌트
- ✅ 라우트와 1:1 매핑
- ✅ 여러 Feature/Entity 조합

**예시:**

- `views/workspace/`: WorkspaceDashboard, WorkspaceSettings
- `views/cpc/`: CPCManagement, PerformanceReview

**코드 특징:**

```tsx
// ✅ 뷰 - 여러 Feature 컴포넌트 조합
import ApplicantFilter from '@features/applicants/ui/ApplicantFilter';
import ApplicantList from '@features/applicants/ui/ApplicantList';
import JobPostingSelector from '@features/job-posting/ui/JobPostingSelector';

const ApplicantManagementView = () => {
  return (
    <div>
      <JobPostingSelector />
      <ApplicantFilter />
      <ApplicantList />
    </div>
  );
};
```

---

### 5. 위젯 (Widget)

**배치 경로:** `src/widgets/{domain}/`

**판단 기준:**

- ✅ 여러 Feature/Entity를 조합한 복합 컴포넌트
- ✅ 독립적으로 동작 가능한 단위
- ✅ 여러 페이지에서 재사용 가능

**예시:**

- `widgets/workspace/`: DashboardSummary, QuickActions, NotificationPanel

**코드 특징:**

```tsx
// ✅ 위젯 - 여러 도메인 조합, 독립 단위
import { useApplicantStats } from '@features/applicants/model/hooks';
import { useJobPostingStats } from '@features/job-posting/model/hooks';

const DashboardSummary = () => {
  const applicantStats = useApplicantStats();
  const jobStats = useJobPostingStats();
  // 여러 도메인 데이터 조합
};
```

---

## 판단 흐름도

```
Figma 컴포넌트 분석
        ↓
┌─ 도메인 독립적인가? ─────────────────────┐
│                                          │
│  YES → 공용 UI (src/shared/ui/)          │
│                                          │
│  NO ↓                                    │
├─ 특정 엔티티를 표현하는가? ──────────────┤
│                                          │
│  YES → 엔티티 UI (src/entities/*/ui/)    │
│                                          │
│  NO ↓                                    │
├─ 특정 Feature에 종속되는가? ─────────────┤
│                                          │
│  YES → 기능 UI (src/features/*/ui/)      │
│                                          │
│  NO ↓                                    │
├─ 페이지 레벨인가? ───────────────────────┤
│                                          │
│  YES → 뷰 (src/views/*/)                 │
│                                          │
│  NO ↓                                    │
└─ 여러 도메인 조합인가? ──────────────────┘
                                           │
   YES → 위젯 (src/widgets/*/)             │
```

## 경계 케이스 처리

### 1. 엔티티 UI vs 기능 UI 구분이 모호할 때

**질문:** "이 컴포넌트가 다른 Feature에서도 사용될 수 있는가?"

- **YES** → 엔티티 UI
- **NO** → 기능 UI

**예시:**

- `ApplicantCard` → 엔티티 UI (여러 곳에서 사용)
- `ApplicantFilterPanel` → 기능 UI (지원자 관리 Feature 전용)

### 2. 공용 UI vs 엔티티 UI 구분이 모호할 때

**질문:** "도메인 타입에 의존하는가?"

- **YES** → 엔티티 UI
- **NO** → 공용 UI

**예시:**

- `StatusBadge` (일반) → 공용 UI
- `ApplicantStatusBadge` (지원자 상태 전용) → 엔티티 UI

### 3. 기능 UI vs 위젯 구분이 모호할 때

**질문:** "단일 Feature의 Hook만 사용하는가?"

- **YES** → 기능 UI
- **NO** (여러 Feature Hook 사용) → 위젯

## 사용자 확인 템플릿

```markdown
## 📁 컴포넌트 유형 확인

분석 결과, 다음과 같이 컴포넌트 유형을 결정했습니다:

| 컴포넌트명      | 유형      | 판단 근거                                 |
| --------------- | --------- | ----------------------------------------- |
| ApplicantCard   | 엔티티 UI | Applicant 엔티티 표현, 여러 곳에서 재사용 |
| ApplicantFilter | 기능 UI   | applicants Feature Hook 사용              |
| StatusBadge     | 공용 UI   | 도메인 독립적, 범용 사용                  |

**이 분류로 진행해도 될까요?**

1. ✅ 진행
2. 📝 수정 요청
```
