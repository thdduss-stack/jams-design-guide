# 다크모드 패턴 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Color > Dark/Light Mode Logic)
> CSS 변수 기반 — data-jds-theme 또는 시스템 다크모드 연동

## 기본 원칙

JAMS는 Gray scale 중간점(500)을 기준으로 Light/Dark 전환:

```
Gray Steps:  50   100  200  300  400  500  600  700  800  900  950
Light Mode:                                     ←텍스트/아이콘 (진한쪽)
Dark Mode:  텍스트/아이콘 (밝은쪽)→
                               ↕
                         500 = 구분점
```

- **Light Mode**: `gray.600` ~ `gray.950` → 텍스트, 아이콘, 테두리
- **Dark Mode**: `gray.50` ~ `gray.400` → 텍스트, 아이콘, 테두리

---

## 공통 시멘틱 토큰 대응표

| 역할 | Light | Dark |
|------|-------|------|
| `color.text.primary` | `gray.950` = `#131618` | `gray.50` = `#F4F6F7` |
| `color.text.secondary` | `gray.600` = `#636C74` | `gray.300` = `#B8BFC5` |
| `color.text.tertiary` | `gray.500` = `#86919A` | `gray.500` = `#86919A` (동일) |
| `color.text.disabled` | `gray.300` = `#B8BFC5` | `gray.700` = `#484F56` |
| `color.bg.base` | `#FFFFFF` | `gray.950` = `#131618` |
| `color.bg.surface` | `gray.50` = `#F4F6F7` | `gray.900` = `#1E2428` |
| `color.bg.surface-hover` | `gray.100` = `#E2E6E8` | `gray.800` = `#30363C` |
| `color.border.default` | `gray.200` = `#D1D6DA` | `gray.700` = `#484F56` |
| `color.bg.interactive-disabled` | `gray.100` = `#E2E6E8` | `gray.800` = `#30363C` |

---

## 브랜드 색상 다크모드 대응

### BizJAMS (HC)
| 역할 | Light | Dark |
|------|-------|------|
| Primary | `blue.500` = `#2684FF` | `blue.400` = `#4598FF` |
| Primary Hover | `blue.600` = `#0060CC` | `blue.300` = `#70B0FF` |
| bg.brand-subtle | `blue.50` = `#EBF5FF` | `blue.900` = `#001C46` |
| border.brand-subtle | `blue.200` = `#A4CEFF` | `blue.700` = `#00469A` |

### CommJAMS JK
| 역할 | Light | Dark |
|------|-------|------|
| Primary | `blue2.500` = `#1B55F6` | `blue2.400` = `#5580FF` |
| Primary Hover | `blue2.600` = `#1240CC` | `blue2.300` = `#82AAFF` |
| bg.brand-subtle | `blue2.50` = `#EEF3FF` | `blue2.900` = `#06124A` |
| border.brand-subtle | `blue2.200` = `#AECCFF` | `blue2.700` = `#0D2EA0` |

### CommJAMS AM
| 역할 | Light | Dark |
|------|-------|------|
| Primary | `orange.500` = `#FF6D12` | `orange.400` = `#FF8D30` |
| Primary Hover | `orange.600` = `#CC4D00` | `orange.300` = `#FFAB5E` |
| bg.brand-subtle | `orange.50` = `#FFF6EE` | `orange.900` = `#421200` |
| border.brand-subtle | `orange.200` = `#FFD09A` | `orange.700` = `#9A3600` |

---

## CSS 변수 구조

```css
/* Light 기본 */
:root {
  --color-text-primary: #131618;
  --color-text-secondary: #636C74;
  --color-bg-base: #FFFFFF;
  --color-bg-surface: #F4F6F7;
  --color-border-default: #D1D6DA;
}

/* Dark 모드 */
[data-theme="dark"],
.dark {
  --color-text-primary: #F4F6F7;
  --color-text-secondary: #B8BFC5;
  --color-bg-base: #131618;
  --color-bg-surface: #1E2428;
  --color-border-default: #484F56;
}
```

---

## Tailwind 다크모드 사용

이 프로젝트는 CSS 변수 기반이므로 시멘틱 클래스가 자동으로 다크모드 대응:

```tsx
// 별도 dark: 접두사 없이 자동 전환
<div className="text-typography-primary bg-box-normal border-line-normal">
  {/* Light: #131618 bg, Dark: #F4F6F7 text 자동 */}
</div>
```

> ⚠️ 이 프로젝트(HC)는 현재 **Light 모드 전용** 구현
> 다크모드 UI 작업 시 `dark:` 클래스가 아닌 CSS 변수 기반 전환 사용
> 실제 다크모드 지원 여부는 PM에게 확인 필요

---

## 버튼 쇼케이스 다크모드 대응

```tsx
// setScTheme 패턴 참조 (design system site 구현 기반)
const isDark = theme.includes('dark');
const isAM = theme.includes('am');

// Surface
surface:   isDark ? '#30363C' : '#F7F8FA'  // gray.800 / gray.50
surfaceHover: isDark ? '#484F56' : '#F0F1F3' // gray.700 / gray.100
border:    isDark ? '#484F56' : '#D1D6DA'  // gray.700 / gray.200

// Text
text1:  isDark ? '#F4F6F7' : '#131618'  // gray.50 / gray.950
text2:  isDark ? '#B8BFC5' : '#636C74'  // gray.300 / gray.600
text3:  isDark ? '#86919A' : '#9EA8AF'  // gray.500 / gray.500(동일)

// Card
cardBg: isDark ? '#1E2428' : '#FFFFFF'  // gray.900 / white
cardBd: isDark ? '#30363C' : '#D1D6DA'  // gray.800 / gray.200
```
