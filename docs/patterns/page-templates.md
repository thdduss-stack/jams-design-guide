# 페이지 템플릿 패턴

> 비즈센터에서 자주 쓰이는 페이지 레이아웃 패턴 모음.
> Claude로 UI 생성 시 이 패턴을 기반으로 요청하세요.

---

## 1. 목록 페이지 (List Page)

테이블 + 필터 + 검색으로 구성되는 가장 일반적인 패턴.

**언제 사용**: 지원자 목록, 공고 목록, 멤버 관리 등

```tsx
export default function ListPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-40 h-[62px] border-b border-gray-200 shrink-0">
        <h1 className="text-20 font-bold text-gray-900">페이지 제목</h1>
        <div className="flex items-center gap-8">
          <Button variant="outlined" size="40" color="primary">내보내기</Button>
          <Button variant="contained" size="40" color="primary">+ 추가</Button>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
        {/* 필터 툴바 */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-8">
            <span className="text-14 font-regular text-gray-600">전체 N건</span>
            {/* 필터 버튼들 */}
          </div>
          <div className="flex items-center gap-8">
            {/* 검색 */}
          </div>
        </div>

        {/* 테이블 */}
        <div className="rounded-12 border border-bluegray-100 overflow-hidden">
          {/* BZWDataTable */}
        </div>
      </main>
    </div>
  )
}
```

---

## 2. 상세 페이지 (Detail Page)

좌: 주요 정보 카드 / 우: 보조 정보 카드 2단 레이아웃.

**언제 사용**: 지원자 상세, 공고 상세, 설정 상세 등

```tsx
export default function DetailPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-40 h-[62px] border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-4 text-14 font-regular text-gray-600">
            <Icon name="system_arrow_right" size="16" color="gray500" className="rotate-180" />
            목록으로
          </button>
          <span className="h-12 w-px bg-bluegray-200" />
          <h1 className="text-20 font-bold text-gray-900">상세 제목</h1>
        </div>
        <div className="flex items-center gap-8">
          <Button variant="outlined" size="40" color="primary">수정</Button>
        </div>
      </header>

      {/* 콘텐츠 */}
      <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
        <div className="flex gap-24">
          {/* 좌: 메인 카드 (67%) */}
          <div className="flex-[2] flex flex-col gap-24">
            <section className="rounded-12 border border-bluegray-100 p-24">
              <h2 className="text-16 font-bold text-gray-900 mb-20">기본 정보</h2>
              {/* 내용 */}
            </section>
          </div>

          {/* 우: 보조 카드 (33%) */}
          <div className="flex-[1] flex flex-col gap-24">
            <section className="rounded-12 border border-bluegray-100 p-24">
              <h2 className="text-16 font-bold text-gray-900 mb-20">상태</h2>
              {/* 내용 */}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## 3. 설정 페이지 (Settings Page)

좌: 탭 네비 / 우: 설정 내용 2단 레이아웃.

**언제 사용**: 계정 설정, 알림 설정, 권한 관리 등

```tsx
export default function SettingsPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center px-40 h-[62px] border-b border-gray-200 shrink-0">
        <h1 className="text-20 font-bold text-gray-900">설정</h1>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 좌: 설정 탭 네비 */}
        <nav className="w-[200px] border-r border-gray-200 py-24 px-16 shrink-0">
          <ul className="flex flex-col gap-4">
            {['기본 설정', '알림', '권한 관리'].map((item) => (
              <li key={item}>
                <button className="w-full text-left px-12 py-8 rounded-8 text-14 font-regular text-gray-700 hover:bg-bluegray-50">
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 우: 설정 내용 */}
        <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
          <section className="max-w-[720px]">
            <h2 className="text-20 font-bold text-gray-900 mb-32">기본 설정</h2>
            {/* 폼 */}
          </section>
        </main>
      </div>
    </div>
  )
}
```

---

## 4. 대시보드 페이지 (Dashboard Page)

지표 카드 + 차트 + 목록 조합 패턴.

**언제 사용**: 홈, 채용 현황, 통계 등

```tsx
export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen max-h-screen">
      <header className="flex items-center px-40 h-[62px] border-b border-gray-200 shrink-0">
        <h1 className="text-20 font-bold text-gray-900">홈</h1>
      </header>

      <main className="flex-1 overflow-auto px-40 pt-32 pb-80">
        {/* 지표 카드 행 */}
        <div className="grid grid-cols-4 gap-24 mb-24">
          {[
            { label: '전체 지원자', value: '128명' },
            { label: '검토 중', value: '43명' },
            { label: '합격', value: '12명' },
            { label: '이번 주 신규', value: '7명' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-12 border border-bluegray-100 p-24">
              <p className="text-14 font-regular text-gray-600 mb-8">{stat.label}</p>
              <p className="text-28 font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 메인 콘텐츠 행 */}
        <div className="flex gap-24">
          {/* 차트/주요 내용 (67%) */}
          <section className="flex-[2] rounded-12 border border-bluegray-100 p-24 h-[396px]">
            <h2 className="text-16 font-bold text-gray-900 mb-20">지원 현황</h2>
          </section>

          {/* 보조 목록 (33%) */}
          <section className="flex-[1] rounded-12 border border-bluegray-100 p-24 h-[396px]">
            <h2 className="text-16 font-bold text-gray-900 mb-20">최근 지원자</h2>
          </section>
        </div>
      </main>
    </div>
  )
}
```

---

## 5. 빈 상태 / 에러 상태 컴포넌트

모든 페이지에서 공통으로 사용하는 상태 UI.

```tsx
// 빈 상태
function EmptyState({ message = '데이터가 없습니다', description, action }: {
  message?: string
  description?: string
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-80 gap-16">
      <Icon name="special_empty" size="48" color="gray300" />
      <div className="flex flex-col items-center gap-4">
        <p className="text-16 font-semibold text-gray-800">{message}</p>
        {description && (
          <p className="text-14 font-regular text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <Button variant="outlined" size="40" color="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// 에러 상태
function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-80 gap-16">
      <Icon name="special_caution" size="48" color="gray300" />
      <div className="flex flex-col items-center gap-4">
        <p className="text-16 font-semibold text-gray-800">문제가 발생했습니다</p>
        <p className="text-14 font-regular text-gray-500">잠시 후 다시 시도해 주세요</p>
      </div>
      {onRetry && (
        <Button variant="outlined" size="40" color="primary" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  )
}
```
