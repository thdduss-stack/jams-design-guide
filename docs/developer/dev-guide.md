# JAMS 디자인 시스템 — 개발자 구현 가이드

> 최종 확인: 2026-04-03
> 토큰 소스: `src/lib/bizjams-c.ts`

---

## 시스템 선택 (가장 먼저)

```
JAMS 2.1 (canonical)
    │
    ├── CommJAMS   잡코리아·알바몬·파트너·임베디드
    │              import from "@/lib/bizjams-c"  (jams tokens)
    │
    └── BizJAMS    워크스페어·비즈센터·HC·ATS
                   import from "@/lib/bizjams-c"  (bizjams tokens)

[JAMS Core] ⛔ 폐기 — 신규 코드 작성 금지
```

| 키워드 | 시스템 |
|--------|--------|
| GNB, 공고카드, 히어로, 메인, Footer, 검색창, 태그 | CommJAMS |
| 비즈센터, HC, 인재검색, TalentCard, FilterBar, ATS | BizJAMS |
| Button, Input, Tag, Card, Modal (순수 공통) | JAMS 2.1 |

---

## 불변 규칙 (시스템 무관)

```typescript
"use client"  // 인터랙션 있는 모든 컴포넌트 최상단 필수
```

| 규칙 | 내용 |
|------|------|
| 하드코딩 금지 | 색상·크기·간격 모두 토큰 참조 |
| inline style만 | CSS Module, Tailwind 클래스 금지 |
| Button 컴포넌트 | `<button>` HTML 직접 작성 금지 |
| 폰트 | Pretendard — 다른 폰트 금지 |
| 레이아웃 | `gridTemplateColumns` 선호 (flex보다) |
| page.tsx | 얇게 — 뷰 로직은 components/로 분리 |
| disabled 상태 | opacity 방식 금지 → gray 토큰 교체 |
| hover 상태 | opacity 방식 금지 → 진한 팔레트 스텝 사용 |

---

## CommJAMS 구현

```typescript
import { palette, typography, fontWeight, fontFamily, spacing, radius, shadow } from "@/lib/bizjams-c"
```

### 주요 색상

```typescript
// Primary (JK)
palette.jk[500]   // #1B55F6 — CTA
palette.jk[600]   // #083CCC — hover
palette.jk[50]    // #F0F2FA — 칩·태그 배경

// Primary (AM)
palette.am[500]   // #FF6D12
palette.am[600]   // #DA5400 — hover

// 텍스트
palette.gray[950] // #1A1A1E — 주요 텍스트 (Light)
palette.gray[600] // #768091 — 보조 텍스트
palette.gray[400] // #AFB5BE — placeholder

// Semantic
palette.red[500]    // #EF4343 — 에러
palette.green[500]  // #0DBC7C — 성공
palette.yellow[500] // #F0B500 — 경고
```

### Radius (CommJAMS)

```typescript
radius[10]   // JK 기본 (버튼·인풋·카드)
radius[4]    // 태그·배지
radius[999]  // pill 버튼·검색창
radius[16]   // AM 기본
```

### 공고 카드 패턴

```typescript
const jobCard: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e6e8ea',
  borderRadius: 10,     // ⚠️ 10px 고정
  padding: '12px 16px',
  fontFamily: fontFamily.base,
}
// 내부 순서: 로고 → 공고명(17px 600) → 회사명+D-day → 태그 row
```

### 태그 패턴 (20px 고정)

```typescript
const tagBase: React.CSSProperties = {
  height: 20,
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
}
```

---

## BizJAMS 구현

```typescript
import { palette, typography, fontWeight, tokens } from "@/lib/bizjams-c"
```

### 주요 색상

```typescript
// Primary — ⚠️ #0060CC (기존 #0057FF 사용 금지)
tokens.color.primary        // #0060CC
tokens.color.primaryHover   // #0049A3

// 텍스트
tokens.color.text            // #222222 — gray900
tokens.color.textSecondary   // #6A6A6A — gray700
tokens.color.textDescription // #9E9E9E — gray500 ⚠️
```

### 컴포넌트 패턴

```typescript
// Primary 버튼
const btnPrimary: React.CSSProperties = {
  height: tokens.height.lg,           // 40px
  padding: '0 20px',
  background: tokens.color.primary,   // #0060CC
  color: '#ffffff',
  border: 'none',
  borderRadius: tokens.radius.sm,     // 4px
  ...typography['body-M-semibold'],
  cursor: 'pointer',
}

// 필터 칩
const chip = (isActive: boolean): React.CSSProperties => ({
  height: tokens.height.sm,           // 32px
  padding: '0 16px',
  border: \`1px solid \${tokens.color.border}\`,
  borderRadius: radius[999],
  background: isActive ? tokens.color.bgSelected : '#ffffff',
  color: isActive ? tokens.color.primary : tokens.color.text,
  fontSize: 13,
  fontWeight: isActive ? 600 : 400,
})
```

---

## JAMS 2.1 공통 컴포넌트

```typescript
import { palette, typography, fontWeight, fontFamily, spacing, radius, shadow } from "@/lib/bizjams-c"
```

### 카드

```typescript
const card: React.CSSProperties = {
  background: '#FFFFFF',
  border: \`1px solid \${palette.gray[200]}\`,
  borderRadius: radius[12],
  padding: spacing[16],
  boxShadow: shadow.default,
}
// hover → boxShadow: shadow.secondary
```

### Filled 버튼

```typescript
const btnFilled: React.CSSProperties = {
  height: 40,
  padding: \`0 \${spacing[16]}px\`,
  background: palette.jk[500],
  color: '#FFFFFF',
  border: 'none',
  borderRadius: radius[8],
  ...typography.b3,
  fontWeight: fontWeight.semibold,
}
// size: lg=52, md=48, sm=40, xs=32
// hover → palette.jk[600]
// disabled → { background: palette.gray[200], color: palette.gray[400] }
```

### 다크 모드 CSS 변수 패턴

```css
:root {
  --color-bg:            #FFFFFF;
  --color-surface:       #F1F2F3;
  --color-text:          #1A1A1E;
  --color-primary:       #1B55F6;
  --color-primary-hover: #083CCC;
}
[data-theme="dark"] {
  --color-bg:            #1A1A1E;
  --color-surface:       #292C32;
  --color-text:          #F1F2F3;
  --color-primary:       #5580FF;
  --color-primary-hover: #83A4FF;
}
```

---

## 파일 구조

```
src/
├── lib/
│   └── bizjams-c.ts          ← 디자인 토큰 단일 소스
├── app/
│   ├── design-system/
│   │   └── page.tsx           ← 시각적 레퍼런스 페이지
│   └── talent-search/         ← BizJAMS 예시
│       └── components/
│           ├── TalentCard.tsx
│           ├── FilterBar.tsx
│           └── ProposeDrawer.tsx
```
