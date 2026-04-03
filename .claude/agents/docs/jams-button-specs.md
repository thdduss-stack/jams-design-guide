# JAMS 버튼 스펙 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Button 탭)
> JAMS 2.0 Figma Button 페이지 전체 스펙

## 버튼 크기 (Size)

| 크기 | Height | Padding X | Font Size | Tailwind |
|------|--------|-----------|-----------|---------|
| lg | 52px | 16px | 16px | `h-52 px-16 text-16` |
| md | 48px | 14px | 16px | `h-48 px-14 text-16` |
| sm | 40px | 12px | 14px | `h-40 px-12 text-14` |
| xs | 32px | 10px | 13px | `h-32 px-10 text-13` |

> BizJAMS HC에서 기본: **sm (40px)**

## 아이콘 크기 (버튼 내)

| 버튼 크기 | leftIcon | rightIcon |
|----------|---------|----------|
| lg / md | 20px | 14px |
| sm / xs | 16px | 14px |

## 아이콘 gap

| 버튼 크기 | gap |
|----------|-----|
| lg / md | 6px |
| sm / xs | 4px |

---

## 버튼 타입

### 1. Filled (주요 액션)

| 토큰 | 설명 | 상태 |
|------|------|------|
| `button.filled.primary` | 주 CTA — bg = Primary | Default / Hover / Disabled / Loading |
| `button.filled.brand` | 브랜드 색 변형 | " |
| `button.filled.brand-dim` | 브랜드 흐린 변형 | " |
| `button.filled.subtle` | 브랜드 bg.subtle | " |

```tsx
// BizJAMS Primary Button
<Button variant="primary" size="sm">제안하기</Button>
// Tailwind: h-40 px-12 rounded-6 bg-button-primary text-white text-14 font-semibold
```

### 2. Outlined (보조 액션)

| 토큰 | 설명 |
|------|------|
| `button.outlined.default` | 테두리만, 중립 |
| `button.outlined.brand` | 테두리만, 브랜드 색 텍스트 |
| `button.outlined.pill` | pill 형태 |

```tsx
<Button variant="outlined">취소</Button>
// Tailwind: h-40 px-12 rounded-6 border border-line-normal bg-box-normal text-14 font-semibold
```

### 3. Borderless (3차 액션)

| 토큰 | 설명 |
|------|------|
| `button.borderless.default` | 배경/테두리 없음 |
| `button.borderless.pill` | pill 형태 |
| `button.borderless.subtle` | 브랜드 색 bg.subtle |

### 4. IconOnly (아이콘 버튼)

정사각형. Loading 없음.

| 토큰 | 설명 |
|------|------|
| `button.icon.primary` | Filled + Circle |
| `button.icon.brand` | 브랜드 변형 + Circle |
| `button.icon.outlined` | 테두리 있음 |
| `button.icon.circle` | 원형 테두리 |
| `button.icon.borderless` | 배경 없음 |
| `button.icon.dark` | 반투명 어두운 배경 |

```tsx
// 아이콘 버튼 크기
h-40 w-40  // sm (기본)
h-32 w-32  // xs
h-48 w-48  // md
h-52 w-52  // lg
```

### 5. Filter (필터 칩)

고정 높이 32px, pill 형태.

| 상태 | 스타일 |
|------|--------|
| Off | bg-box-normal border border-line-normal text-typography-secondary |
| On | bg-button-primary text-white |

```tsx
// 필터 칩 패턴
<button className={`h-32 px-12 rounded-999 text-13 font-semibold ${
  isActive 
    ? 'bg-button-primary text-white'
    : 'bg-box-normal border border-line-normal text-typography-secondary'
}`}>
  직군
</button>
```

### 6. Text / TextLink

배경·테두리·패딩 없음.

| 토큰 | Size |
|------|------|
| `button.text.brand.lg` | 16px |
| `button.text.brand.md` | 14px |
| `button.text.brand.sm` | 13px |
| `button.text.primary.lg` | 16px |
| `button.text.primary.md` | 14px |
| `button.text.secondary.sm` | 13px |
| `button.text.link.md` | 14px (링크 화살표 스타일) |
| `button.text.link.sm` | 13px |

### 7. Special Buttons

| 타입 | 설명 |
|------|------|
| `button.search` | pill, Primary bg — 검색 버튼 |
| `button.filter.icon` | 아이콘 포함 필터 |
| `button.top` | 56×56 원형, 상단으로 이동 |
| `button.product` | pill 32px, 상품 선택 |
| `button.pagination.arrow` | 64×32, 페이지 화살표 |
| `button.pagination.number` | 32×32, 페이지 번호 |
| `button.scrap` | 24×24, 스크랩(북마크) |
| `button.text.link` | icontext 스타일 |

---

## 버튼 상태

| 상태 | 설명 |
|------|------|
| Default | 기본 |
| Hover | 약간 어두워짐 (filter: brightness) |
| Disabled | bg: gray.100 / text: gray.300 / cursor: not-allowed |
| Loading | Primary bg 유지, 텍스트 숨김, 스피너 표시 |

```tsx
// Disabled 패턴
<Button disabled>
// Tailwind: bg-[#E2E6E8] text-[#B8BFC5] cursor-not-allowed

// @jds/theme 컴포넌트 사용 (HTML button 직접 사용 금지)
import { Button } from '@jds/theme';
<Button variant="primary" disabled>제안하기</Button>
```

---

## BizJAMS HC 빠른 참조

```tsx
// 제안하기 (주요 CTA)
<Button variant="primary">제안하기</Button>

// 취소/보조
<Button variant="outlined">취소</Button>

// 필터 칩
<Button variant="filter" active={isActive}>직군</Button>

// 아이콘 버튼
<Button variant="icon-outlined">
  <BZWIcon name="system_more" size="16" />
</Button>

// 더보기 링크
<button className="jb-text jb-text-brand text-14">더보기 →</button>
```

---

## Radius (테마별 버튼)

| | BizJAMS | JK CommJAMS | AM CommJAMS |
|-|---------|-------------|-------------|
| lg (52) | `rounded-6` (6px) | `rounded-[10px]` | `rounded-16` |
| md (48) | `rounded-6` | `rounded-[10px]` | `rounded-16` |
| sm (40) | `rounded-6` | `rounded-[10px]` | `rounded-12` |
| xs (32) | `rounded-4` (4px) | `rounded-6` | `rounded-8` |

> ⚠️ BizJAMS(HC): 버튼 radius = 6px, 카드 = 8px (가장 각짐)
