# JDS + BizJAMS 디자인 시스템 레퍼런스

> HC 채용담당자 화면(이 프로젝트)은 **BizJAMS** 기준 적용.
> Design System 사이트: https://coololivia.github.io/jams-design-system/

---

## 1. 시스템 계층 및 적용 기준

```
JAMS 2.1 (canonical)
├── CommJAMS — 잡코리아·알바몬 구직자 화면 (JK Light / AM Light)
└── BizJAMS  — 비즈센터·HC·ATS (B2B)  ← 이 프로젝트
```

| 키워드 | 시스템 |
|--------|--------|
| GNB, 공고카드, 히어로, 메인, 검색창, 태그 | CommJAMS |
| 비즈센터, HC, 인재검색, TalentCard, FilterBar, D-BZW | **BizJAMS** |
| Button, Input, Tag, Card, Modal 순수 공통 | JAMS 2.1 |

---

## 2. 듀얼 브랜드 & 테마

| 브랜드 | Primary (Light) | Primary (Dark) | 적용 |
|--------|----------------|----------------|------|
| BizJAMS (HC) | `blue.500` = `#2684FF` | `blue.400` = `#4598FF` | 이 프로젝트 |
| CommJAMS JK | `blue2.500` = `#1B55F6` | `blue2.400` = `#5580FF` | 잡코리아 |
| CommJAMS AM | `orange.500` = `#FF6D12` | `orange.400` = `#FF8D30` | 알바몬 |

> ⚠️ `#0057FF` 사용 금지. BizJAMS는 `blue.500 = #2684FF`.

```tsx
// 테마 전환 (CommJAMS만 해당)
<div data-jds-theme="jobkorea">...</div>
<div data-jds-theme="albamon">...</div>
// BizJAMS(HC) — CSS 변수로 직접 적용, data-jds-theme 없음
```

### Radius 비교 (테마별)

| 테마 | 버튼 (sm/md) | 카드 | Pill |
|------|-------------|------|------|
| **BizJAMS** | **6px** (`rounded-6`) | **8px** (`rounded-8`) | 999px |
| CommJAMS JK | 10px | 12px | 999px |
| CommJAMS AM | 16px | 16px | 999px |

> ⚠️ BizJAMS 전용 — 버튼 6px, 카드 8px. CommJAMS와 혼용 금지.

---

## 3. Tailwind 커스텀 스케일 (이 프로젝트 전용)

> ⚠️ 기본 Tailwind와 다릅니다. 반드시 이 스케일 사용.

### spacing (px 기반)
```
gap-0, gap-2, gap-4, gap-6, gap-8, gap-10, gap-12, gap-13, gap-14,
gap-16, gap-20, gap-24, gap-28, gap-32, gap-40, gap-48, gap-52,
gap-56, gap-60, gap-72, gap-80
```
→ `gap-4` = **4px** (기본 Tailwind gap-4 = 16px와 다름!)

### borderRadius
```
rounded-0, rounded-2, rounded-4, rounded-6, rounded-8,
rounded-12, rounded-16, rounded-20, rounded-24, rounded-999
```
→ `rounded-999` 사용 (`rounded-full` 금지)

### BizJAMS Radius 빠른 참조
```tsx
rounded-4    // 태그 (4px)
rounded-6    // 버튼, 인풋 (6px)
rounded-8    // 카드, 패널 (8px)
rounded-999  // 필터 칩, 뱃지
```

### fontSize (lineHeight, letterSpacing 자동 연동)
```
text-11, text-12, text-13, text-14, text-15, text-16,
text-18, text-20, text-24, text-28, text-32, text-36
```

### fontWeight
```
font-regular (400), font-medium (500), font-semibold (600), font-bold (700)
```

> ⚠️ Heading 전체: `font-semibold`(600). `font-bold`(700) 사용 금지.

---

## 4. 색상 팔레트 & 시멘틱 토큰

### Primitive Palette (전체)

**Gray (중립 / 텍스트 / 배경)**
| Step | Hex | 용도 |
|------|-----|------|
| 50 | `#F4F6F7` | 페이지 배경, surface |
| 100 | `#E2E6E8` | 비활성 배경 |
| 200 | `#D1D6DA` | border.default |
| 300 | `#B8BFC5` | text.tertiary (dark) / disabled (light) |
| 400 | `#9EA8AF` | — |
| 500 | `#86919A` | text.tertiary (light) — 구분점 |
| 600 | `#636C74` | text.secondary (light) |
| 700 | `#484F56` | border.default (dark) |
| 800 | `#30363C` | surface (dark) |
| 900 | `#1E2428` | bg.surface (dark) |
| 950 | `#131618` | text.primary (light) / bg.base (dark) |

**Blue (BizJAMS Brand)**
| Step | Hex |
|------|-----|
| 50 | `#EBF5FF` |
| 100 | `#CCE4FF` |
| 200 | `#A4CEFF` |
| 300 | `#70B0FF` |
| 400 | `#4598FF` |
| **500** | **`#2684FF`** ← BizJAMS Primary (Light) |
| **600** | **`#0060CC`** ← Hover |
| 700 | `#00469A` |
| 800 | `#002F6E` |
| 900 | `#001C46` |

**Blue2 (CommJAMS JK Brand)**
| Step | Hex |
|------|-----|
| 50 | `#EEF3FF` |
| 200 | `#AECCFF` |
| 400 | `#5580FF` ← JK Dark Primary |
| **500** | **`#1B55F6`** ← CommJAMS JK Primary (Light) |
| 600 | `#1240CC` |
| 700 | `#0D2EA0` |

**Orange (CommJAMS AM Brand)**
| Step | Hex |
|------|-----|
| 50 | `#FFF6EE` |
| 400 | `#FF8D30` ← AM Dark Primary |
| **500** | **`#FF6D12`** ← CommJAMS AM Primary (Light) |
| 600 | `#CC4D00` |

**상태 색상**
- Red `#F22A23` (red.500 — Error)
- Green `#02B160` (green.500 — Success)
- Yellow `#FFBB00` (yellow.500 — Warning)
- Violet `#7C3AED` (violet.500 — 보조 강조)

### Brand Subtle (브랜드 서브틀 색상)
| 테마 | bg.brand-subtle | border.brand-subtle |
|------|----------------|---------------------|
| Biz Light | `blue.50` = `#EBF5FF` | `blue.200` = `#A4CEFF` |
| Biz Dark | `blue.900` = `#001C46` | `blue.700` = `#00469A` |
| JK Light | `blue2.50` = `#EEF3FF` | `blue2.200` = `#AECCFF` |
| JK Dark | `blue2.900` = `#06124A` | `blue2.700` = `#0D2EA0` |
| AM Light | `orange.50` = `#FFF6EE` | `orange.200` = `#FFD09A` |

### 시멘틱 (Light → Tailwind 클래스)
```
text-typography-primary     → gray.950 (#131618)
text-typography-secondary   → gray.600 (#636C74)
text-typography-disabled    → gray.300 (#B8BFC5)
border-line-normal          → gray.200 (#D1D6DA)
bg-box-normal               → gray.50  (#F4F6F7)
bg-button-primary           → 브랜드별 Primary
```

### Dark Mode 대응
- `gray.500`이 구분점: Light는 600~950 (어두운쪽), Dark는 50~400 (밝은쪽)
- 시멘틱 클래스는 CSS 변수 기반으로 자동 전환 (별도 `dark:` 접두사 불필요)
- 이 프로젝트(HC)는 현재 **Light 모드 전용** 구현

### 공통 시멘틱 토큰 대응표 (Light / Dark)
| 역할 | Light | Dark |
|------|-------|------|
| text.primary | `gray.950` = `#131618` | `gray.50` = `#F4F6F7` |
| text.secondary | `gray.600` = `#636C74` | `gray.300` = `#B8BFC5` |
| text.tertiary | `gray.500` = `#86919A` | `gray.500` (동일) |
| text.disabled | `gray.300` = `#B8BFC5` | `gray.700` = `#484F56` |
| bg.base | `#FFFFFF` | `gray.950` = `#131618` |
| bg.surface | `gray.50` = `#F4F6F7` | `gray.900` = `#1E2428` |
| bg.surface-hover | `gray.100` = `#E2E6E8` | `gray.800` = `#30363C` |
| border.default | `gray.200` = `#D1D6DA` | `gray.700` = `#484F56` |

### BizJAMS 토큰 (구 버전 — 레거시 코드 참고용)
```typescript
import { palette, typography, fontWeight, tokens } from '@/lib/bizjams-c';
tokens.color.primary = '#0060CC'  // ⚠️ 구버전 (현재: #2684FF)
tokens.radius.sm = 4px / tokens.radius.md = 6px
tokens.height.sm = 32px / tokens.height.md = 36px / tokens.height.lg = 40px
```

> ⚠️ HEX 직접 사용 금지 — 반드시 시멘틱 토큰 또는 Tailwind 클래스 사용

---

## 5. 타이포그래피

### HC 프로젝트 실제 사용 패턴

```typescript
// 페이지/섹션 제목
text-20 font-semibold    // H3 상당 (BizJAMS)
text-18 font-semibold    // H4 상당

// 본문 주요 텍스트
text-16 font-semibold    // body-L-semibold
text-14 font-semibold    // body-M-semibold (테이블 헤더, 라벨)
text-14 font-medium      // body-M-medium (이름, 학력)
text-14 font-regular     // body-M-regular (날짜, 일반)

// 보조/설명
text-13 font-regular     // caption-M
text-12 font-regular     // caption-S

// 숫자/통계 (대시보드)
text-28 font-semibold    // metric-L
```

### Letter Spacing 규칙
```
Display, H1~H4  → letter-spacing: 0.5px
H5, Body, Caption → letter-spacing: 0px
```

> `text-17` `text-48` 없음 → `text-16` / `text-18`로 근사값 사용

---

## 6. 스페이싱 · 그림자

### Semantic Spacing
| 토큰 | 값 | 용도 |
|------|-----|-----|
| component.xs | 4px | 아이콘-텍스트 간격 |
| component.sm | 8px | 인풋 내부 패딩 |
| component.md | 12px | 버튼 패딩 |
| component.lg | 16px | 카드 내부 패딩 |
| component.xl | 24px | 모달 내부 패딩 |

### Shadow
| 용도 | CSS 값 |
|------|--------|
| 기본 카드 | `0px 4px 16px 0px rgba(0,0,0,0.07)` |
| 카드 hover | `0px 4px 16px 0px rgba(0,0,0,0.12)` |
| 드롭다운 | `0px 4px 8px 0px rgba(0,0,0,0.2)` |
| sticky 하단바 | `0px -2px 12px 0px rgba(0,0,0,0.12)` |

---

## 7. 버튼 스펙 (@jds/theme Button)

### 크기
| Size | Height | Padding X | Font | Tailwind |
|------|--------|-----------|------|---------|
| lg | 52px | 16px | 16px | `h-52 px-16 text-16` |
| md | 48px | 14px | 16px | `h-48 px-14 text-16` |
| **sm** | **40px** | **12px** | **14px** | `h-40 px-12 text-14` ← BizJAMS 기본 |
| xs | 32px | 10px | 13px | `h-32 px-10 text-13` |

### Variant
```tsx
<Button variant="primary">제안하기</Button>
// h-40 px-12 rounded-6 bg-button-primary text-white text-14 font-semibold

<Button variant="outlined">취소</Button>
// h-40 px-12 rounded-6 border border-line-normal bg-box-normal text-14 font-semibold

// 필터 칩 (h-32, pill)
<button className={`h-32 px-12 rounded-999 text-13 font-semibold ${
  isActive ? 'bg-button-primary text-white' : 'bg-box-normal border border-line-normal text-typography-secondary'
}`}>직군</button>
```

### Disabled 상태
```tsx
// bg-[#E2E6E8] text-[#B8BFC5] cursor-not-allowed
<Button disabled>제안하기</Button>
```

---

## 8. @jds/theme 컴포넌트 목록

HTML 네이티브 폼 요소 대신 **반드시** @jds/theme 사용:

```typescript
// 폼 (필수)
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
```

| HTML | JDS 컴포넌트 |
|------|-------------|
| `<button>` | `<Button>` |
| `<input type="text">` | `<TextField.Root><TextField.Input /></TextField.Root>` |
| `<input type="checkbox">` | `<Checkbox>` |
| `<input type="radio">` | `<RadioGroup.Root><RadioGroup.Item /></RadioGroup.Root>` |
| `<select>` | `<SelectBox.Root><SelectBox.Trigger /><SelectBox.Content /></SelectBox.Root>` |

---

## 9. 아이콘 규칙

**BZWIcon 우선**, 없을 때만 `@jds/theme Icon`:

```typescript
// 1순위: BZWIcon special_*
import BZWIcon from '@shared/ui/BZWIcon';
<BZWIcon name="special_flight" size="16" />

// 2순위: BZWIcon system_*
<BZWIcon name="system_mail" size="16" />

// 3순위: @jds/theme Icon (BZWIcon에 없을 때만)
import { Icon } from '@jds/theme';
<Icon name="system_check" size="16" />
```

새로운 아이콘 패키지 설치 금지.

---

## 10. BizJAMS QA 체크리스트

### BizJAMS 전용
- [ ] Primary = `blue.500 = #2684FF` (구버전 `#0060CC` / `#0057FF` 아님 ⚠️)
- [ ] Heading `fontWeight`: **600** (700 금지)
- [ ] `body-M-bold` 없음 → `body-M-semibold` 사용
- [ ] 이름 마스킹 적용 (`accepted` 제외 → `성**` 처리)
- [ ] 테이블: `gridTemplateColumns` 사용 (flex 금지)
- [ ] 버튼 radius: **6px** (CommJAMS 10px와 혼용 금지)
- [ ] `"use client"` 선언 (인터랙션 있는 컴포넌트)
- [ ] Ant Design 6.x 호환 확인

### Tailwind 스케일 주의사항 (공통)
- [ ] `gap-4` = **4px** (기본 Tailwind gap-4 = 16px와 다름!)
- [ ] `rounded-999` 사용 (`rounded-full` 아님)
- [ ] `text-14` = 14px, `font-semibold` = 600

### 공통 (시스템 무관)
- [ ] 하드코딩 없음 — 색상·크기·간격 모두 토큰 참조
- [ ] `<button>` HTML 직접 작성 금지 → JDS 컴포넌트 사용
- [ ] 폰트: Pretendard (다른 폰트 금지, Noto Sans KR 포함)
- [ ] `disabled` 상태: opacity 방식 금지 → gray 토큰 교체
- [ ] `hover` 상태: opacity 방식 금지 → 더 진한 팔레트 스텝 사용
- [ ] `page.tsx` 얇게 — 뷰 로직은 `components/`로 분리

### CommJAMS QA (잡코리아/알바몬, 참고)
- [ ] 카드 radius: **10px** (JK) / **16px** (AM) — BizJAMS 6px와 혼용 금지
- [ ] 태그 높이: **20px** / fontSize: **11px** / fontWeight: **600**
- [ ] D-day 색상: **`#f37676`** (다른 빨강 사용 금지)
- [ ] GNB 검색창 border: **1.5px** (1px 아님)

---

## 11. 레이아웃 (BizJAMS 1440px 기준)

```
D-BZWHeader (48px) + D-BZWSider (64px) + Body (1376px)
```

**해상도**: 데스크톱 전용 min 1038px ~ max 1856px

### HC 인재 테이블 그리드
```typescript
gridTemplateColumns: '180px 1fr 1fr 200px 240px'
```

### 특수 레이아웃
```typescript
// ProposeDrawer (우측)
width: 480px

// ChargeModal
// 1300px 이상: { width: 800 }
// 1300px 미만: { width: 800, height: '100vh', borderRadius: 0 }
```

---

## 12. 이름 마스킹 (BizJAMS 필수)

```typescript
// accepted 상태: 전체 이름 노출
// 나머지 모든 상태: 성** 처리
function maskName(name: string): string {
  return name[0] + '**';
}
```

---

## 관련 Figma 파일

| 파일 | 키 | 시스템 |
|------|-----|--------|
| JAMS Core | `NiWp4FeJudLewDP3OSa0i4` | JAMS 2.1 |
| PC Assets (잡코리아) | `yB8Vz6IaE0H9dq2ml2gqpH` | CommJAMS |
| 비즈센터 홈 | `52kVTYI3GOkjGTCZKFxZhU` | BizJAMS |
| HC 인재검색 | `uy4pUNV15IRjwQ7SL3FaO8` | BizJAMS |

---

## 비즈센터 홈 화면 규격

> Figma: https://www.figma.com/design/52kVTYI3GOkjGTCZKFxZhU/%EB%B9%84%EC%A6%88%EC%84%BC%ED%84%B0--%ED%99%88?node-id=1245-6590
> ⚠️ Figma MCP 접근 가능 시 이 섹션을 실제 규격으로 업데이트하세요.

참조 파일:
- `.claude/agents/docs/bizcenter-home-spec.md` — 기능 정의서 (케이스별 노출 조건)
- `.claude/agents/docs/bizcenter-home-design.md` — 컴포넌트 스펙 + Mock 데이터

### 화면 개요

- 패턴: `StatCards + List + RecentActivity` 복합 대시보드
- 레이아웃: 단일 컬럼 스크롤 (상·중·하 섹션 수직 배치)
- 해상도: 데스크톱 전용 (1038px ~ 1856px), BizJAMS Light

### 레이아웃 구조

```
┌──────────────────────────────────────────────┐
│  [회사 정보]  [회원 정보 + 권한 관리]  [통계]  │ ← 상단 (3열 그리드)
├──────────────────────────────────────────────┤
│  [비즈머니 — 3열: 비즈머니/무료포인트/소멸예정] │ ← 중단 상부
├──────────────────────────────────────────────┤
│  [기업홈 배너 (캐러셀, 3초 자동슬라이드)]      │ ← 중단
├──────────────────────────────────────────────┤
│  [공고 현황] [채용 진행중 지원자 (4탭)]        │ ← 중단 (2열)
│  [면접캘린더] [지원자 면탁]                   │
├──────────────────────────────────────────────┤
│  [공지사항] [FAQ] [채용컨설턴트/고객센터]      │ ← 하단 (3열)
└──────────────────────────────────────────────┘
```

### 주요 컴포넌트 목록

| 컴포넌트 | 위치 | 주요 규격 |
|---------|------|---------|
| 회사 정보 카드 | 상단 | 로고 48×48, `rounded-8`, 기업명 `text-16 font-semibold` |
| 기업인증 상태 배지 | 상단 회원정보 | `text-11 font-semibold px-6 py-2 rounded-4 border` |
| 권한 관리 (마스터 전용) | 상단 | 마스터가 아니면 미노출 |
| 통계 그래프 | 상단 | 주간 지원수 바 차트, h-80 |
| 비즈머니 현황 | 중단 | `grid grid-cols-3`, 숫자 `text-20 font-semibold` |
| 기업홈 배너 | 중단 | `@jds/theme Carousel`, autoPlay 3초, 배너 1개 이하 시 dots 없음 |
| 공고 현황 | 중단 | 진행중/대기중/마감 카운트 + 리스트 (`grid-cols-3`) |
| 채용 진행중 지원자 | 중단 | `@jds/theme Tabs` 4탭 (미열람/면접일정조정/면접종료/미심사) |
| 지원자 카드 | 중단 탭 내 | TalentCard 패턴, 이름 마스킹 필수 (`maskName()`) |
| 면접캘린더 | 중단 | 오늘 날짜(MM.DD) + 면접 건수, 캘린더 이동 버튼 |
| 지원자 면탁 | 중단 | 메시지 타입 배지 + 메시지 + 이력서 보기 버튼 |
| 공지사항 | 하단 | 제목 + 날짜, `border-b border-line-normal` 구분 |
| FAQ | 하단 | Q. 질문 텍스트, `border-b border-line-normal` 구분 |
| 채용컨설턴트/고객센터 | 하단 | RM 배정 여부에 따라 분기 노출 |

### 권한별 노출 차이

| 권한 | 권한 관리 섹션 |
|------|-------------|
| 마스터 | 노출 (승인 대기 초대 현황 포함) |
| 일반 멤버 | 미노출 |
| 간편 멤버 | 미노출 |

### 주요 치수

```
헤더 높이: 48px
섹션 패딩: px-40 (BizJAMS 기준)
카드 내부 패딩: p-16 ~ p-20
그리드 gap: gap-16
지원자 카드 높이: py-12 (auto height)
공고 리스트 행 높이: h-56
비즈머니 숫자: text-20 font-semibold
소멸예정 포인트 있으면: text-red-500
```

### Mock 데이터 위치

```typescript
// .claude/agents/docs/bizcenter-home-design.md 의 mockHomeData 참조
// src/{layer}/bizcenter-home/model/mock/home.mock.ts 에 배치 권장
```
