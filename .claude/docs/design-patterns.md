# 디자인 패턴 레퍼런스

> HC 채용 플랫폼에서 반복되는 레이아웃/컴포넌트 패턴 정의.
> UI 생성 시 레이아웃 선택 기준으로 사용.

---

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

```tsx
// FilterBar
<div className="flex items-center gap-8 border-b border-line-normal px-24 h-48">
  {/* 필터칩들 */}
</div>

// Table grid (HC 기본)
<div className="grid" style={{ gridTemplateColumns: '28px 72px 1fr 80px 100px 120px' }}>

// TableRow
<div className="grid h-56 items-center border-b border-line-normal px-16 hover:bg-box-normal">
```

---

## 2. FilterBar + CardGrid

공고 목록, 추천 인재 등 카드형 브라우징.

```tsx
// 4열 그리드
<div className="grid grid-cols-4 gap-16 p-24">

// 카드 (BizJAMS)
<div className="rounded-8 border border-line-normal bg-white p-16 hover:shadow-md transition-shadow">
```

---

## 3. TwoColumn (상세 화면)

인재 상세, 공고 상세 등 정보 + 액션 분리.

```tsx
<div className="flex gap-24 p-24">
  <div className="flex-1 flex flex-col gap-16"> {/* 주요 정보 (1fr) */} </div>
  <div className="w-80 flex-shrink-0 flex flex-col gap-12"> {/* 액션 패널 (300-400px) */} </div>
</div>
```

---

## 4. StatCards + Chart + RecentList (대시보드)

```tsx
// StatCards (4열)
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

제안하기, 메모, 빠른 상세 조회. BizJAMS ProposeDrawer: **width 480px**, 우측 고정.

```tsx
<div className="fixed right-0 top-0 h-full bg-white shadow-lg"
  style={{ width: 480 }}>
```

---

## 7. 페이지 레이아웃 템플릿

### 목록 페이지

```tsx
export default function ListPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center justify-between px-40 h-[62px] border-b border-line-normal shrink-0">
        <h1 className="text-20 font-semibold text-typography-primary">페이지 제목</h1>
        <Button variant="primary">+ 추가</Button>
      </header>
      <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
        {/* 필터 + 테이블 */}
      </main>
    </div>
  )
}
```

### 상세 페이지

```tsx
export default function DetailPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center justify-between px-40 h-[62px] border-b border-line-normal shrink-0">
        {/* 뒤로가기 + 제목 */}
      </header>
      <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
        <div className="flex gap-24">
          <div className="flex-[2] flex flex-col gap-24"> {/* 메인 (67%) */} </div>
          <div className="flex-[1] flex flex-col gap-24"> {/* 보조 (33%) */} </div>
        </div>
      </main>
    </div>
  )
}
```

### 설정 페이지

```tsx
export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="px-40 h-[62px] border-b border-line-normal shrink-0">
        <h1 className="text-20 font-semibold text-typography-primary">설정</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-[200px] border-r border-line-normal py-24 px-16 shrink-0">
          {/* 탭 네비 */}
        </nav>
        <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
          {/* 설정 내용 */}
        </main>
      </div>
    </div>
  )
}
```

---

## 8. 카드 컴포넌트 스펙

### BizJAMS 기본 카드

```tsx
<div className="rounded-8 border border-line-normal bg-white p-16">
  {/* hover: shadow-md 추가 */}
</div>
```

### TalentCard (HC 인재 카드)

```tsx
<div className="flex items-center gap-12 py-12 border-b border-line-normal hover:bg-box-normal px-16 cursor-pointer">
  <div className="w-40 h-40 rounded-999 bg-box-normal overflow-hidden flex-shrink-0">
    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
  </div>
  <div className="flex-1 min-w-0">
    <span className="text-14 font-semibold text-typography-primary">{maskName(name)}</span>
    {/* 이름 마스킹: accepted 제외 → 성** */}
  </div>
</div>
```

---

## 9. 공통 상태 UI

### 빈 상태 (Empty State)

```tsx
<div className="flex flex-col items-center gap-12 py-80 text-typography-secondary">
  <Icon name="system_document" size="48" />
  <p className="text-14 font-regular">검색 결과가 없습니다</p>
  <Button variant="outlined">조건 초기화</Button>
</div>
```

### 로딩 상태 (Skeleton)

```tsx
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

## 10. 색상 역할 빠른 참조

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
