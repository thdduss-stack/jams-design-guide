# Dark Mode 토큰 가이드

> 확정일: 2026-04-02
> 출처: [Discussion #9 — Architecture](https://github.com/coololivia/jams-design-system/discussions/9)

---

## 핵심 원칙

1. **Dark mode = mode 플립 하나로 동작**
2. `semantic-dark`가 neutral 전체를 담당 → 브랜드별 dark 파일에 neutral 중복 정의하지 않음
3. `theme-*-dark` 파일은 **brand 토큰만** 담당 (~10개)

## CSS 레이어 적용 순서

```css
:root                                    /* semantic light (기본) */
[data-mode="dark"]                       /* semantic-dark (neutral 14개) */
[data-brand="jk"]                        /* theme-jk (brand light) */
[data-mode="dark"][data-brand="jk"]      /* theme-jk-dark (brand dark) */
[data-brand="am"]                        /* theme-am */
[data-mode="dark"][data-brand="am"]      /* theme-am-dark */
```

## 파일 구조

```
semantic.tokens.json          ← light neutral base (기존 유지)
semantic-dark.tokens.json     ← dark neutral overrides (JK/AM 공유)
theme-jk.tokens.json          ← JK brand light
theme-jk-dark.tokens.json     ← JK brand dark overrides만 (~10개)
theme-am.tokens.json          ← AM brand light
theme-am-dark.tokens.json     ← AM brand dark overrides만 (~10개)
```

> `theme-jk-light` / `theme-am-light`는 **deprecated**. `theme-jk.tokens.json` / `theme-am.tokens.json`으로 대체됨.

## semantic-dark에 포함된 토큰 (14개)

| 토큰 | Dark 값 |
|------|---------|
| `color.bg.base` | gray.950 |
| `color.bg.surface` | gray.900 |
| `color.bg.elevated` | gray.800 |
| `color.bg.interactive-disabled` | gray.800 |
| `color.text.primary` | gray.50 |
| `color.text.secondary` | gray.300 |
| `color.text.tertiary` | gray.500 |
| `color.text.disabled` | gray.700 |
| `color.border.default` | gray.700 |
| `color.border.subtle` | gray.800 |
| `color.border.strong` | gray.600 |
| `color.icon.primary` | gray.300 |
| `color.icon.secondary` | gray.500 |

## Light / Dark 매핑표 (실무용)

| 용도 | Light | Dark |
|------|-------|------|
| 페이지 배경 | `#FFFFFF` | Gray 950 `#1A1A1E` |
| 카드/표면 | Gray 50 `#F1F2F3` | Gray 900 `#292C32` |
| 주요 텍스트 | Gray 950 `#1A1A1E` | Gray 50 `#F1F2F3` |
| 보조 텍스트 | Gray 600 `#768091` | Gray 300 `#C2C6CD` |
| 구분선 | Gray 200 `#D5D8DC` | Gray 700 `#575F6C` |
| JK Primary | `#1B55F6` (blue2.500) | `#5580FF` (blue2.400) |
| AM Primary | `#FF6D12` (orange.500) | `#FF8D30` (orange.400) |
| JK Hover | `#083CCC` (blue2.600) | `#83A4FF` |
| AM Hover | `#DA5400` (orange.600) | — |

## CSS 변수 패턴 (구현 예시)

```css
:root {
  --color-bg:            #FFFFFF;
  --color-surface:       #F1F2F3;
  --color-text:          #1A1A1E;
  --color-text2:         #768091;
  --color-border:        #D5D8DC;
  --color-primary:       #1B55F6;
  --color-primary-hover: #083CCC;
}

[data-theme="dark"] {
  --color-bg:            #1A1A1E;
  --color-surface:       #292C32;
  --color-text:          #F1F2F3;
  --color-text2:         #C2C6CD;
  --color-border:        #575F6C;
  --color-primary:       #5580FF;
  --color-primary-hover: #83A4FF;
}
```
