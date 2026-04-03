# 비주얼 디자인 패턴 레퍼런스

> HC 채용 플랫폼에서 반복되는 레이아웃/컴포넌트 패턴 정의.
> `design-from-description` 에이전트에서 레이아웃 선택 기준으로 사용.

## 패턴 선택 기준

| 화면 유형 | 패턴 |
|---------|------|
| 인재 목록 / 공고 목록 | FilterBar + Table |
| 카드형 브라우징 | FilterBar + CardGrid |
| 인재/공고 상세 | TwoColumn |
| 통계 / 현황 | StatCards + Chart + RecentList |
| 단계별 입력 | StepForm |
| 설정 / 관리 | SideNav + ContentArea |
| 확인/경고 | Dialog (Modal) |
| 빠른 액션 | Drawer (우측 슬라이드) |

---

## 1. FilterBar + Table (가장 많이 쓰임)

HC 인재 검색, 지원자 목록 등 데이터 조회 화면.

```
┌─────────────────────────────────────────┐
│ [필터칩] [필터칩] [필터칩]    [검색창]  │ ← FilterBar (h-48, border-b)
├─────────────────────────────────────────┤
│ 총 N건           [정렬] [내보내기]      │ ← ResultBar (h-40)
├────┬────────┬──────┬──────┬────────────┤
│ □  │ 이름   │ 직군 │ 경력 │ 액션       │ ← TableHeader (h-40, bg-gray-50)
├────┼────────┼──────┼──────┼────────────┤
│ □  │ 홍*동  │ 개발 │ 3년  │ [제안] [▼] │ ← TableRow (h-56)
│ □  │ 김*수  │ 디자 │ 5년  │ [제안] [▼] │
└────┴────────┴──────┴──────┴────────────┘
│ < 1 2 3 ... 10 >                        │ ← Pagination
```

**Tailwind 패턴:**
```tsx
// FilterBar
<div className="flex items-center gap-8 border-b border-line-normal px-24 h-48">
  {/* 필터칩들 */}
</div>

// Table grid (HC 기본)
// gridTemplateColumns: '28px 72px 1fr 80px 100px 120px'
<div className="grid" style={{ gridTemplateColumns: '28px 72px 1fr 80px 100px 120px' }}>

// TableRow
<div className="grid h-56 items-center border-b border-line-normal px-16 hover:bg-box-normal">
```

---

## 2. FilterBar + CardGrid

공고 목록, 추천 인재 등 카드형 브라우징.

```
┌────────────────────────────────────────┐
│ [필터칩] [필터칩]             [정렬▼]  │ ← FilterBar
├────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │
│ │ 카드 │ │ 카드 │ │ 카드 │ │ 카드 │  │ ← 4열 그리드
│ └──────┘ └──────┘ └──────┘ └──────┘  │
│ ┌──────┐ ┌──────┐ ...                 │
└────────────────────────────────────────┘
```

**Tailwind 패턴:**
```tsx
// 4열 그리드
<div className="grid grid-cols-4 gap-16 p-24">

// 카드 (BizJAMS)
<div className="rounded-8 border border-line-normal bg-white p-16 hover:shadow-md transition-shadow">
```

---

## 3. TwoColumn (상세 화면)

인재 상세, 공고 상세 등 정보 + 액션 분리.

```
┌──────────────────┬─────────────────┐
│                  │                 │
│  주요 정보       │  액션 패널      │
│  (1fr)           │  (300-400px)    │
│                  │                 │
│  섹션 1          │  [제안하기]     │
│  섹션 2          │  [메모]         │
│  섹션 3          │  [히스토리]     │
│                  │                 │
└──────────────────┴─────────────────┘
```

**Tailwind 패턴:**
```tsx
<div className="flex gap-24 p-24">
  <div className="flex-1 flex flex-col gap-16"> {/* 주요 정보 */} </div>
  <div className="w-80 flex-shrink-0 flex flex-col gap-12"> {/* 액션 패널 */} </div>
</div>
```

---

## 4. StatCards + Chart + RecentList (대시보드)

현황 통계, 주요 지표 요약 화면.

```
┌──────┬──────┬──────┬──────┐
│ 지원 │ 검토 │ 합격 │ 제안 │  ← StatCards (4열)
│  N건 │  N건 │  N건 │  N건 │
└──────┴──────┴──────┴──────┘
┌──────────────────┬──────────────┐
│  차트/그래프     │  최근 활동   │
│  (2/3)           │  (1/3)       │
└──────────────────┴──────────────┘
```

**Tailwind 패턴:**
```tsx
// StatCards
<div className="grid grid-cols-4 gap-16">
  <div className="rounded-8 border border-line-normal p-20 flex flex-col gap-4">
    <span className="text-13 font-regular text-typography-secondary">지원</span>
    <span className="text-28 font-semibold text-typography-primary">128건</span>
  </div>
</div>

// 2/3 + 1/3 레이아웃
<div className="grid grid-cols-3 gap-16">
  <div className="col-span-2"> {/* 차트 */} </div>
  <div className="col-span-1"> {/* 최근 활동 */} </div>
</div>
```

---

## 5. StepForm (단계별 입력)

공고 등록, 프로필 작성 등 여러 단계 입력.

```
┌────────────────────────────────────┐
│  ① 기본정보  ② 조건  ③ 확인      │ ← StepIndicator
├────────────────────────────────────┤
│                                    │
│  [입력 폼 내용]                    │
│                                    │
├────────────────────────────────────┤
│              [이전]  [다음 →]      │ ← Actions
└────────────────────────────────────┘
```

**Tailwind 패턴:**
```tsx
// StepIndicator
<div className="flex items-center gap-8 px-24 py-16 border-b border-line-normal">
  {steps.map((step, i) => (
    <div key={i} className={`flex items-center gap-4 text-13 ${
      i === current ? 'text-typography-primary font-semibold' : 'text-typography-secondary'
    }`}>
      <span className={`w-20 h-20 rounded-999 flex items-center justify-center text-11 ${
        i === current ? 'bg-button-primary text-white' : 'bg-box-normal'
      }`}>{i + 1}</span>
      {step.label}
    </div>
  ))}
</div>
```

---

## 6. Drawer (우측 슬라이드 패널)

제안하기, 메모, 빠른 상세 조회 등.

```
┌────────────────┬────────────┐
│                │ ← Drawer   │
│  메인 화면     │  제목      │
│                │  ────────  │
│                │  내용      │
│                │            │
│                │  [액션]    │
└────────────────┴────────────┘
```

BizJAMS ProposeDrawer 기준: **width 480px**, 우측 고정

```tsx
// width는 고정값 사용 (Tailwind 커스텀 스케일 범위 밖)
<div className="fixed right-0 top-0 h-full bg-white shadow-lg"
  style={{ width: 480 }}>
```

---

## 카드 컴포넌트 스펙

### BizJAMS 기본 카드

```tsx
<div className="rounded-8 border border-line-normal bg-white p-16">
  {/* 내용 */}
</div>
// hover: shadow-md 추가
```

### TalentCard (HC 인재 카드)

```
┌───────────────────────────────────┐
│ [사진 40x40] 홍*동    개발 · 3년  │
│             서울 · 대졸           │
│ ─────────────────────────────────│
│ [Java] [Spring] [React]           │ ← 스킬 태그
│                    [제안] [저장]  │ ← 액션
└───────────────────────────────────┘
```

---

## 공통 UI 요소

### 빈 상태 (Empty State)

```tsx
<div className="flex flex-col items-center gap-12 py-80 text-typography-secondary">
  <Icon name="system_document" size="48" />
  <p className="text-14 font-regular">검색 결과가 없습니다</p>
  <Button variant="outlined">조건 초기화</Button>
</div>
```

### 로딩 상태

```tsx
// Skeleton 패턴
<div className="animate-pulse">
  <div className="h-14 w-40 rounded-4 bg-box-normal mb-8" />
  <div className="h-14 w-full rounded-4 bg-box-normal" />
</div>
```

### 에러 상태

```tsx
<div className="flex flex-col items-center gap-12 py-48 text-red-500">
  <Icon name="system_error" size="32" />
  <p className="text-14">데이터를 불러올 수 없습니다</p>
  <Button onClick={handleRetry}>다시 시도</Button>
</div>
```

---

## @jds/theme 전체 컴포넌트 목록

```typescript
// 폼
import { Button, TextField, Checkbox, RadioGroup, SelectBox } from '@jds/theme';

// 오버레이
import { Dialog, AlertDialog, DropdownMenu, ContextMenu, Popover, Tooltip } from '@jds/theme';

// 네비게이션
import { Tabs, NavigationMenu, MenuBar, Carousel } from '@jds/theme';

// 레이아웃
import { Accordion, Collapsible, AspectRatio } from '@jds/theme';

// 피드백
import { Toast, MrNotification } from '@jds/theme';

// 토글
import { Toggle, ToggleGroup } from '@jds/theme';

// 아이콘 (BZWIcon 우선, 없으면 @jds/theme)
import { Icon } from '@jds/theme';
```

---

## 색상 역할 빠른 참조

| 역할 | Tailwind 클래스 |
|------|----------------|
| 주요 텍스트 | `text-typography-primary` |
| 보조 텍스트 | `text-typography-secondary` |
| 비활성 | `text-typography-disabled` |
| 구분선 | `border-line-normal` |
| 배경 | `bg-box-normal` |
| Primary 버튼 | `bg-button-primary` |
| 에러 | `text-red-500`, `border-red-500` |
| 성공 | `text-green-500` |
