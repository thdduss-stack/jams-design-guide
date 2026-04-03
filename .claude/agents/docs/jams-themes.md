# JAMS 테마 시스템 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Color > Theme Preview)
> 8개 테마: JK Light/Dark · AM Light/Dark · JP Light/Dark(미확정) · Biz Light/Dark

## 테마 선택 기준

| 화면 | 테마 |
|------|------|
| HC 채용담당자 (이 프로젝트) | **BizJAMS** (`Biz Light` / `Biz Dark`) |
| 잡코리아 구직자/통합 | CommJAMS JK (`JK Light` / `JK Dark`) |
| 알바몬 구직자 | CommJAMS AM (`AM Light` / `AM Dark`) |
| 잡플래닛 | JP (미확정 · placeholder) |

---

## Biz Light (HC 기본 — 이 프로젝트)

| 역할 | 토큰 | Hex |
|------|------|-----|
| Primary | `blue.500` | `#2684FF` |
| Primary Hover | `blue.600` | `#0060CC` |
| Primary Active | `blue.700` | `#00469A` |
| BG | — | `#FFFFFF` |
| Surface | `gray.50` | `#F4F6F7` |
| Text Primary | `gray.950` | `#131618` |
| Text Secondary | `gray.600` | `#636C74` |
| Border | `gray.200` | `#D1D6DA` |

> ⚠️ `bizjams-tokens.md`의 `tokens.color.primary = #0060CC`는 구 버전
> 현재 JAMS 2.1 기준: BizJAMS Primary = `blue.500` = `#2684FF`

## Biz Dark

| 역할 | Hex |
|------|-----|
| Primary | `#4598FF` (blue.400) |
| Primary Hover | `#70B0FF` (blue.300) |
| BG | `#131618` (gray.950) |
| Surface | `#1E2428` (gray.900) |
| Text Primary | `#F4F6F7` (gray.50) |
| Text Secondary | `#B8BFC5` (gray.300) |
| Border | `#484F56` (gray.700) |

---

## JK Light (CommJAMS 잡코리아)

| 역할 | 토큰 | Hex |
|------|------|-----|
| Primary | `blue2.500` | `#1B55F6` |
| Primary Hover | `blue2.600` | `#1240CC` |
| Primary Active | `blue2.700` | `#0D2EA0` |
| BG | — | `#FFFFFF` |
| Surface | `gray.50` | `#F4F6F7` |
| Text | `gray.950` | `#131618` |
| Text2 | `gray.600` | `#636C74` |
| Border | `gray.200` | `#D1D6DA` |

## JK Dark

| 역할 | Hex |
|------|-----|
| Primary | `#5580FF` (blue2.400) |
| Primary Hover | `#82AAFF` (blue2.300) |
| BG | `#131618` (gray.950) |
| Surface | `#1E2428` (gray.900) |
| Text | `#F4F6F7` (gray.50) |
| Text2 | `#B8BFC5` (gray.300) |
| Border | `#484F56` (gray.700) |

---

## AM Light (CommJAMS 알바몬)

| 역할 | 토큰 | Hex |
|------|------|-----|
| Primary | `orange.500` | `#FF6D12` |
| Primary Hover | `orange.600` | `#CC4D00` |
| Primary Active | `orange.700` | `#9A3600` |
| Border Radius (버튼) | — | 16px (JK 10px보다 큼) |

## AM Dark

| 역할 | Hex |
|------|-----|
| Primary | `#FF8D30` (orange.400) |
| Primary Hover | `#FFAB5E` (orange.300) |

---

## `data-jds-theme` 속성

```tsx
// 잡코리아 테마 적용
<div data-jds-theme="jobkorea">
  {/* blue2.500 = #1B55F6 primary */}
</div>

// 알바몬 테마 적용
<div data-jds-theme="albamon">
  {/* orange.500 = #FF6D12 primary */}
</div>

// BizJAMS (HC) — 별도 테마 없음, CSS 변수로 직접 적용
```

---

## Radius 비교 (테마별)

| 테마 | 버튼 LG/MD | 버튼 SM | 버튼 XS |
|------|-----------|---------|---------|
| JK | 10px | 10px | 6px |
| AM | 16px | 12px | 8px |
| BizJAMS | **6px** | **6px** | **4px** |

> BizJAMS는 전체적으로 가장 각진 스타일

---

## Brand Subtle (버튼 hover overlay)

| 테마 | bg.brand-subtle | border.brand-subtle |
|------|----------------|---------------------|
| JK Light | `blue2.50` = `#EEF3FF` | `blue2.200` = `#AECCFF` |
| JK Dark | `blue2.900` = `#06124A` | `blue2.700` = `#0D2EA0` |
| AM Light | `orange.50` = `#FFF6EE` | `orange.200` = `#FFD09A` |
| AM Dark | `orange.900` = `#421200` | `orange.700` = `#9A3600` |
| Biz Light | `blue.50` = `#EBF5FF` | `blue.200` = `#A4CEFF` |
| Biz Dark | `blue.900` = `#001C46` | `blue.700` = `#00469A` |
