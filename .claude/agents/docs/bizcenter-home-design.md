# 비즈센터 홈 디자인 레퍼런스

> Figma: https://www.figma.com/design/52kVTYI3GOkjGTCZKFxZhU/%EB%B9%84%EC%A6%88%EC%84%BC%ED%84%B0--%ED%99%88?node-id=1245-6590
> 기능 정의: `.claude/agents/docs/bizcenter-home-spec.md`
> 시스템: BizJAMS (HC) — Primary `#2684FF`, 버튼 radius 6px, 카드 radius 8px

---

## 화면 개요

비즈센터 홈은 **채용담당자의 대시보드** 역할.
- 패턴: `StatCards + List + RecentActivity` 복합 대시보드
- 레이아웃: 단일 컬럼 스크롤 (상·중·하 섹션 수직 배치)
- 해상도: 데스크톱 전용 (1038px ~ 1856px)
- 테마: BizJAMS Light

---

## 레이아웃 구조

```
┌──────────────────────────────────────────────┐
│  [회사 정보]  [회원 정보 + 권한 관리]  [통계]  │ ← 상단 (3열 그리드)
├──────────────────────────────────────────────┤
│  [비즈머니]                                   │ ← 중단 상부
├──────────────────────────────────────────────┤
│  [기업홈 배너 (캐러셀)]                        │ ← 중단
├──────────────────────────────────────────────┤
│  [공고 현황] [채용 진행중 지원자]              │ ← 중단 (2열)
│  [면접캘린더] [지원자 면탁]                   │
├──────────────────────────────────────────────┤
│  [공지사항] [FAQ] [채용컨설턴트/고객센터]      │ ← 하단 (3열)
└──────────────────────────────────────────────┘
```

---

## 섹션별 컴포넌트 스펙

### 회사 정보 카드

```tsx
// BizJAMS 기본 카드 패턴
<div className="rounded-8 border border-line-normal bg-white p-16 flex items-center gap-12">
  {/* 기업 로고 */}
  <div className="w-48 h-48 rounded-8 border border-line-normal overflow-hidden flex-shrink-0">
    <img src={logoUrl} alt={companyName} className="w-full h-full object-contain" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-16 font-semibold text-typography-primary truncate">{companyName}</p>
  </div>
  {/* 더보기 버튼 */}
  <Button variant="outlined" size="xs">더보기</Button>
</div>
```

---

### 회원 정보 섹션

```tsx
// 기업인증 상태 배지
const certStatusMap = {
  '미인증': { label: '미인증', className: 'bg-red-50 text-red-500 border-red-200' },
  '심사중': { label: '심사중', className: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  '성공':   { label: '인증완료', className: 'bg-green-50 text-green-600 border-green-200' },
  '실패':   { label: '인증실패', className: 'bg-red-50 text-red-500 border-red-200' },
};

// 권한 배지
const roleMap = {
  '마스터':    { label: 'Master', className: 'bg-button-primary text-white' },
  '일반':      { label: '일반', className: 'bg-box-normal text-typography-secondary' },
  '간편멤버':  { label: '간편', className: 'bg-box-normal text-typography-secondary' },
};

// 배지 공통
<span className={`text-11 font-semibold px-6 py-2 rounded-4 border ${statusClass}`}>
  {label}
</span>
```

**미인증 케이스 — 경고 팝업 인라인:**
```tsx
<div className="flex items-center gap-8 p-12 rounded-8 bg-red-50 border border-red-200">
  <BZWIcon name="system_warning" size="16" className="text-red-500 flex-shrink-0" />
  <p className="text-13 font-regular text-red-500">기업인증 후 공고등록이 가능합니다</p>
  <Button variant="outlined" size="xs" className="ml-auto">인증하기</Button>
</div>
```

---

### 권한 관리 (마스터 전용)

```tsx
// Case 5: 멤버 없음 — 초대 유도
<div className="flex flex-col items-center gap-8 py-20 text-typography-secondary">
  <BZWIcon name="system_people" size="24" />
  <p className="text-13 font-regular">멤버를 초대해 보세요!</p>
  <Button variant="primary" size="xs">초대하기</Button>
</div>

// Case 2~4: 카운트 표시
<div className="flex items-center justify-between">
  <span className="text-14 font-regular text-typography-secondary">승인 대기</span>
  <span className="text-14 font-semibold text-typography-primary">{count}명</span>
</div>
```

---

### 통계 섹션

```tsx
// 주간 지원수 그래프 영역
<div className="rounded-8 border border-line-normal bg-white p-16">
  <div className="flex items-center justify-between mb-12">
    <span className="text-14 font-semibold text-typography-primary">주간 지원수</span>
    <Button variant="borderless" size="xs">더보기 →</Button>
  </div>
  {/* 그래프 영역 — 차트 라이브러리 or SVG */}
  <div className="h-80">{/* Chart Component */}</div>
</div>

// 채용 리포트
<div className="flex items-center gap-12 py-12 border-b border-line-normal">
  <span className="flex-1 text-14 font-regular text-typography-primary truncate">{reportName}</span>
  <Button variant="outlined" size="xs">
    <BZWIcon name="system_download" size="14" />
    다운로드
  </Button>
</div>
```

---

### 비즈머니 현황

```tsx
// 3열 그리드 (비즈머니 / 무료 포인트 / 소멸 예정)
<div className="grid grid-cols-3 gap-16 rounded-8 border border-line-normal bg-white p-20">
  <div className="flex flex-col gap-4">
    <span className="text-12 font-regular text-typography-secondary">비즈머니</span>
    {bizMoney > 0
      ? <span className="text-20 font-semibold text-typography-primary">{bizMoney.toLocaleString()}P</span>
      : <div className="flex flex-col gap-8">
          <span className="text-13 font-regular text-typography-disabled">보유 비즈머니가 없습니다</span>
          <Button variant="primary" size="xs">충전하기</Button>
        </div>
    }
  </div>
  <div className="flex flex-col gap-4">
    <span className="text-12 font-regular text-typography-secondary">무료 포인트</span>
    <span className="text-20 font-semibold text-typography-primary">
      {freePoint > 0 ? `${freePoint.toLocaleString()}P` : '-'}
    </span>
  </div>
  <div className="flex flex-col gap-4">
    <span className="text-12 font-regular text-typography-secondary">소멸 예정</span>
    <span className={`text-20 font-semibold ${expiringPoint > 0 ? 'text-red-500' : 'text-typography-primary'}`}>
      {expiringPoint > 0 ? `${expiringPoint.toLocaleString()}P` : '-'}
    </span>
  </div>
</div>
```

---

### 기업홈 배너 (캐러셀)

```tsx
// Carousel 컴포넌트 (@jds/theme)
import { Carousel } from '@jds/theme';

// Case 1: 배너 2개 이상 — 자동 슬라이딩 3초
<Carousel autoPlay interval={3000} showDots={banners.length > 1}>
  {banners.map((banner) => (
    <div key={banner.id} className="rounded-8 overflow-hidden">
      <img src={banner.imageUrl} alt={banner.title} className="w-full" />
    </div>
  ))}
</Carousel>

// Case 2~3: 배너 0~1개 — 페이징 없음
<div className="rounded-8 overflow-hidden">
  {banners[0] && <img src={banners[0].imageUrl} alt={banners[0].title} className="w-full" />}
</div>
```

---

### 공고 현황

```tsx
// 카운트 바 (진행중 / 대기중 / 마감)
<div className="grid grid-cols-3 gap-8 mb-16">
  {[
    { label: '진행중', count: activeCount, color: 'text-button-primary' },
    { label: '대기중', count: waitingCount, color: 'text-typography-secondary' },
    { label: '마감', count: closedCount, color: 'text-typography-disabled' },
  ].map(({ label, count, color }) => (
    <div key={label} className="flex flex-col items-center gap-4 p-12 rounded-8 border border-line-normal">
      <span className="text-12 font-regular text-typography-secondary">{label}</span>
      <span className={`text-20 font-semibold ${color}`}>{count}</span>
    </div>
  ))}
</div>

// 진행중 공고 리스트 아이템
<div className="grid h-56 items-center border-b border-line-normal px-16 hover:bg-box-normal"
  style={{ gridTemplateColumns: '1fr 80px 120px 80px' }}>
  <span className="text-14 font-medium text-typography-primary truncate">{jobTitle}</span>
  <span className="text-13 font-regular text-typography-secondary">{applicantCount}명</span>
  <span className="text-13 font-regular text-typography-secondary truncate">{managerName}</span>
  <Button variant="outlined" size="xs">상품 추천</Button>
</div>

// Case 2~3: 공고 없음 — 유도 영역
<div className="flex flex-col items-center gap-12 py-48 text-typography-secondary">
  <BZWIcon name="system_document" size="32" />
  <p className="text-14 font-regular">등록된 공고가 없습니다</p>
  <Button variant="primary">공고 등록하기</Button>
</div>
```

---

### 채용 진행중 지원자 탭

```tsx
// 4탭 구조 (미열람 / 면접일정조정 / 면접종료 / 미심사)
import { Tabs } from '@jds/theme';

<Tabs defaultValue="unread">
  <Tabs.List>
    <Tabs.Trigger value="unread">미열람 <span className="text-button-primary">{unreadCount}</span></Tabs.Trigger>
    <Tabs.Trigger value="interview-adjust">면접일정조정</Tabs.Trigger>
    <Tabs.Trigger value="interview-done">면접종료</Tabs.Trigger>
    <Tabs.Trigger value="unreviewed">미심사</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="unread">
    {/* 지원자 카드 리스트 */}
  </Tabs.Content>
</Tabs>

// 지원자 카드 (TalentCard 패턴)
<div className="flex items-center gap-12 py-12 border-b border-line-normal hover:bg-box-normal px-16 cursor-pointer">
  {/* 프로필 사진 */}
  <div className="w-40 h-40 rounded-999 bg-box-normal overflow-hidden flex-shrink-0">
    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-6 mb-2">
      <span className="text-14 font-semibold text-typography-primary">{maskName(name)}</span>
      {/* 이름 마스킹: accepted 제외 → 성** */}
      <span className="text-13 font-regular text-typography-secondary">{career} · {age}세</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-12 font-regular text-typography-secondary">{residence}</span>
      <span className="text-typography-disabled">·</span>
      <span className="text-12 font-regular text-typography-secondary truncate">{recentCareer}</span>
    </div>
    <span className="text-12 font-regular text-typography-disabled mt-2 block truncate">
      {appliedJobTitle}
    </span>
  </div>
</div>
```

> ⚠️ 이름 마스킹: `accepted` 상태 제외 → `maskName(name)` 사용 (`성**` 형태)

---

### 면접캘린더

```tsx
<div className="rounded-8 border border-line-normal bg-white p-16 flex items-center justify-between">
  <div className="flex flex-col gap-4">
    <span className="text-12 font-regular text-typography-secondary">오늘 면접</span>
    <div className="flex items-baseline gap-6">
      <span className="text-13 font-regular text-typography-secondary">{today} {/* MM.DD */}</span>
      <span className="text-20 font-semibold text-typography-primary">{todayCount}건</span>
    </div>
  </div>
  <Button variant="outlined" size="sm">
    <BZWIcon name="system_calendar" size="16" />
    캘린더 이동
  </Button>
</div>
```

---

### 지원자 면탁

```tsx
// 면탁 카드 (메시지 / 면접 제안 / 결과 안내)
<div className="rounded-8 border border-line-normal bg-white p-16 flex flex-col gap-12">
  <div className="flex items-center gap-8">
    <span className="text-12 font-semibold px-6 py-2 rounded-4 bg-box-normal text-typography-secondary">
      {messageType} {/* 면접 제안 | 결과 안내 */}
    </span>
    <span className="text-12 font-regular text-typography-disabled">{date}</span>
  </div>
  <p className="text-14 font-regular text-typography-primary">{message}</p>
  <div className="flex justify-end">
    <Button variant="outlined" size="xs">이력서 보기</Button>
  </div>
</div>
```

---

### 하단 (공지사항 / FAQ / 고객센터)

```tsx
// 3열 그리드
<div className="grid grid-cols-3 gap-16 border-t border-line-normal pt-24">

  {/* 공지사항 */}
  <div className="flex flex-col gap-8">
    <span className="text-14 font-semibold text-typography-primary">공지사항</span>
    {notices.map(n => (
      <div key={n.id} className="flex items-center justify-between py-8 border-b border-line-normal">
        <span className="text-13 font-regular text-typography-primary truncate">{n.title}</span>
        <span className="text-12 font-regular text-typography-disabled ml-8 flex-shrink-0">{n.date}</span>
      </div>
    ))}
  </div>

  {/* FAQ */}
  <div className="flex flex-col gap-8">
    <span className="text-14 font-semibold text-typography-primary">FAQ</span>
    {faqs.map(f => (
      <div key={f.id} className="py-8 border-b border-line-normal">
        <span className="text-13 font-regular text-typography-secondary">Q. {f.question}</span>
      </div>
    ))}
  </div>

  {/* 채용컨설턴트 / 고객센터 */}
  <div className="flex flex-col gap-8">
    <span className="text-14 font-semibold text-typography-primary">
      {rm ? '채용컨설턴트' : '고객센터'}
    </span>
    {rm
      ? <>
          <span className="text-14 font-semibold text-typography-primary">{rm.name}</span>
          <span className="text-13 font-regular text-typography-secondary">{rm.phone}</span>
          <span className="text-13 font-regular text-typography-secondary">{rm.email}</span>
          <span className="text-12 font-regular text-typography-disabled">{rm.consultingHours}</span>
        </>
      : <>
          <span className="text-13 font-regular text-typography-secondary">{cs.phone}</span>
          <span className="text-13 font-regular text-typography-secondary">{cs.email}</span>
          <span className="text-12 font-regular text-typography-disabled">{cs.hours}</span>
        </>
    }
  </div>

</div>
```

---

## Mock 데이터 패턴

```typescript
// 홈 화면 전체 Mock
const mockHomeData = {
  company: {
    name: '잡코리아(주)',
    logoUrl: '/images/company-logo.png',
  },
  member: {
    id: 'recruiter@jobkorea.co.kr',
    certStatus: 'success' as const, // 'unverified' | 'pending' | 'success' | 'failed'
    role: 'master' as const,        // 'master' | 'general' | 'simple'
  },
  permission: {
    pendingInviteCount: 3,
    memberCount: 5,
  },
  stats: {
    weeklyApplications: [12, 8, 15, 20, 18, 11, 9],
    reports: [{ id: 1, name: '2024년 4분기 채용결과보고서' }],
  },
  bizMoney: {
    balance: 150000,
    freePoint: 0,
    expiringPoint: 30000,
  },
  banners: [
    { id: 1, imageUrl: '/banners/banner1.png', title: '채용 프리미엄 서비스' },
    { id: 2, imageUrl: '/banners/banner2.png', title: '이력서 열람권 이벤트' },
  ],
  jobs: {
    active: [
      { id: 1, title: '프론트엔드 개발자', applicantCount: 23, managerName: '김채용', product: '프리미엄' },
      { id: 2, title: 'UX 디자이너', applicantCount: 8, managerName: '이담당', product: '스탠다드' },
    ],
    waitingCount: 2,
    closedCount: 14,
  },
  applicants: {
    unread: [
      { id: 1, name: '홍**', career: '경력', age: 28, residence: '서울', recentCareer: '카카오 FE 개발', appliedJob: '프론트엔드 개발자' },
      { id: 2, name: '김**', career: '신입', age: 25, residence: '경기', recentCareer: '대학교 졸업', appliedJob: 'UX 디자이너' },
    ],
    interviewAdjust: [],
    interviewDone: [],
    unreviewed: [],
  },
  interview: {
    todayDate: '04.03',
    todayCount: 3,
  },
  rm: {
    name: '박RM',
    phone: '02-1234-5678',
    email: 'rm@jobkorea.co.kr',
    consultingHours: '09:00~18:00 (주말 제외)',
  },
};
```

---

## 디자인 에이전트 사용 가이드

- **design-to-code**: Figma URL + 이 문서 참조 → 컴포넌트 생성
- **design-from-description**: "비즈센터 홈 만들어줘" → 이 문서에서 레이아웃/컴포넌트 선택
- **mock-generator**: 위 Mock 데이터 패턴을 베이스로 시나리오별 변형
- **designer-systematic**: BizJAMS 토큰 100% 준수 (`bizjams-tokens.md` 참조)
- **designer-creative**: 레이아웃 창의적 판단 허용, JDS 컴포넌트는 필수

## 관련 문서

- 기능 정의: `.claude/agents/docs/bizcenter-home-spec.md`
- BizJAMS 토큰: `.claude/agents/docs/bizjams-tokens.md`
- 컬러 팔레트: `.claude/agents/docs/jams-color-palette.md`
- 버튼 스펙: `.claude/agents/docs/jams-button-specs.md`
- 비주얼 패턴: `.claude/agents/docs/visual-design-patterns.md`
