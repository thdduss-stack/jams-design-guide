# JAMS 2.1 Semantic Tokens

> B2C canonical 시스템 — Color + Space 소유·정의
> CommJAMS는 이 토큰을 그대로 상속

---

## Semantic Color Tokens (Light)

### Background

| 토큰 | Primitive | Hex | 용도 |
|------|-----------|-----|------|
| `color.bg.base` | white | `#FFFFFF` | 페이지 배경 |
| `color.bg.surface` | gray.50 | `#F1F2F3` | 카드/표면 |
| `color.bg.elevated` | white | `#FFFFFF` | 모달/팝업 |
| `color.bg.interactive` | *테마별* | JK:`#1B55F6` AM:`#FF6D12` | 버튼 primary fill |
| `color.bg.interactive-hover` | *테마별* | JK:`#083CCC` AM:`#DA5400` | 호버 |
| `color.bg.interactive-disabled` | gray.200 | `#D5D8DC` | 비활성 |
| `color.bg.brand` | *테마별* 400 | JK:`#5580FF` AM:`#FF8D30` | 브랜드 배경 |
| `color.bg.brand-subtle` | *테마별* 50 | JK:`#F0F2FA` AM:`#FBF4EF` | 연한 브랜드 배경 |

### Text

| 토큰 | Primitive | Hex |
|------|-----------|-----|
| `color.text.primary` | gray.950 | `#1A1A1E` |
| `color.text.secondary` | gray.800 | `#3E434B` |
| `color.text.tertiary` | gray.600 | `#768091` |
| `color.text.disabled` | gray.500 | `#949BA8` |
| `color.text.inverse` | white | `#FFFFFF` |
| `color.text.brand` | *테마별* | JK:`#1B55F6` AM:`#FF6D12` |
| `color.text.danger` | red.500 | `#FC3B3B` |

### Border

| 토큰 | Primitive | Hex |
|------|-----------|-----|
| `color.border.default` | gray.200 | `#D5D8DC` |
| `color.border.subtle` | gray.100 | `#E6E8EA` |
| `color.border.strong` | gray.400 | `#AFB5BE` |
| `color.border.brand` | *테마별* | JK:`#1B55F6` AM:`#FF6D12` |

### Icon

| 토큰 | Primitive | Hex |
|------|-----------|-----|
| `color.icon.primary` | gray.600 | `#768091` |
| `color.icon.secondary` | gray.400 | `#AFB5BE` |
| `color.icon.inverse` | white | `#FFFFFF` |
| `color.icon.brand` | *테마별* | JK:`#1B55F6` AM:`#FF6D12` |

---

## Spacing (Semantic)

### Component

| 토큰 | 값 | 용도 |
|------|-----|------|
| `space.component.xs` | 4px | 아이콘-텍스트 |
| `space.component.sm` | 8px | 인풋 내부 |
| `space.component.md` | 12px | 버튼 패딩 |
| `space.component.lg` | 16px | 카드 내부 |
| `space.component.xl` | 24px | 모달 내부 |

### Layout

| 토큰 | 값 | 용도 |
|------|-----|------|
| `space.layout.xs` | 16px | 섹션 내부 |
| `space.layout.sm` | 24px | 섹션 간 |
| `space.layout.md` | 32px | 블록 간 |
| `space.layout.lg` | 48px | 페이지 섹션 간 |
| `space.layout.xl` | 64px | 페이지 상하 여백 |

---

## Radius (테마별)

| 토큰 | JK | AM | 용도 |
|------|----|----|------|
| `radius.component.xs` | 6px | 6px | 소형 요소 |
| `radius.component.sm` | 10px | 12px | — |
| `radius.component.md` | **10px** | **16px** | 버튼·인풋 기본 |
| `radius.component.lg` | 12px | 18px | 카드 |
| `radius.component.xl` | 16px | 20px | 모달 |
| `radius.component.pill` | 999px | 999px | Pill |

---

## 테마 Override 매핑

| 토큰 | JK Light | JK Dark | AM Light | AM Dark |
|------|----------|---------|----------|---------|
| `color.bg.interactive` | `#1B55F6` | `#5580FF` | `#FF6D12` | `#FF8D30` |
| `color.bg.interactive-hover` | `#083CCC` | `#83A4FF` | `#DA5400` | — |
| `color.text.brand` | `#1B55F6` | `#5580FF` | `#FF6D12` | `#FF8D30` |
| `color.border.brand` | `#1B55F6` | `#5580FF` | `#FF6D12` | `#FF8D30` |
| `color.icon.brand` | `#1B55F6` | `#5580FF` | `#FF6D12` | `#FF8D30` |

---

## Button 컴포넌트 토큰

### Size Matrix

| Size | 높이 | 패딩 | 폰트 | 아이콘 |
|------|------|------|------|--------|
| `lg` | 52px | 0 24px | b2 (16px) 600 | 24px |
| `md` | 48px | 0 20px | b3 (15px) 600 | 22px |
| `sm` | 40px | 0 16px | b4 (14px) 600 | 20px |
| `xs` | 32px | 0 12px | c1 (13px) 600 | 18px |

### Variant 목록

| 군 | Variant |
|----|---------|
| filled | primary, brand, brand-dim, subtle |
| outlined | default, brand, pill |
| borderless | default, pill, subtle |
| icon | primary, brand, outlined, circle, borderless, dark |
| text | brand, primary, secondary, link |
| filter | item, icon-text, icon-only |
| special | floating, search, top |

### 상태 처리 원칙

- **hover**: 더 진한 팔레트 스텝 사용 (투명도 방식 금지)
- **disabled**: 전용 gray 색상으로 교체 (투명도 방식 금지)
- **dark mode**: Primary는 더 밝은 스텝, Gray는 반전
