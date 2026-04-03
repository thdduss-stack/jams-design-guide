# JAMS 스페이싱 · 라디우스 · 그림자 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Spacing / Radius / Shadow 탭)

## Spacing (간격)

> 2px base, 4px grid 기반 · 20 스텝 · 0~80px

### Primitive Scale

| 토큰 | 값 | Tailwind |
|------|-----|---------|
| `spacing.0` | 0px | `gap-0` |
| `spacing.2` | 2px | `gap-2` |
| `spacing.4` | 4px | `gap-4` |
| `spacing.6` | 6px | `gap-6` |
| `spacing.8` | 8px | `gap-8` |
| `spacing.10` | 10px | `gap-10` |
| `spacing.12` | 12px | `gap-12` |
| `spacing.14` | 14px | `gap-14` |
| `spacing.16` | 16px | `gap-16` |
| `spacing.18` | 18px | — |
| `spacing.20` | 20px | `gap-20` |
| `spacing.24` | 24px | `gap-24` |
| `spacing.32` | 32px | `gap-32` |
| `spacing.36` | 36px | — |
| `spacing.40` | 40px | `gap-40` |
| `spacing.48` | 48px | `gap-48` |
| `spacing.56` | 56px | `gap-56` |
| `spacing.64` | 64px | — |
| `spacing.80` | 80px | `gap-80` |

> ⚠️ `gap-4` = **4px** (Tailwind 기본 16px과 다름!)

### Semantic Spacing

| 토큰 | 값 | 용도 |
|------|-----|-----|
| `spacing.component.xs` | 4px | 아이콘-텍스트 간격 |
| `spacing.component.sm` | 8px | 인풋 내부 패딩 |
| `spacing.component.md` | 12px | 버튼 패딩 |
| `spacing.component.lg` | 16px | 카드 내부 패딩 |
| `spacing.component.xl` | 24px | 모달 내부 패딩 |
| `spacing.layout.xs` | 16px | 섹션 내부 |
| `spacing.layout.sm` | 24px | 섹션 간 |
| `spacing.layout.md` | 32px | 블록 간 |
| `spacing.layout.lg` | 48px | 페이지 섹션 간 |
| `spacing.layout.xl` | 64px | 페이지 상하 여백 |

---

## Border Radius (라디우스)

> 19 스텝

| 토큰 | 값 | Tailwind | 용도 |
|------|-----|---------|-----|
| `radius.1` | 1px | — | — |
| `radius.2` | 2px | `rounded-2` | — |
| `radius.4` | 4px | `rounded-4` | 태그 (BizJAMS) |
| `radius.6` | 6px | `rounded-6` | 버튼 (BizJAMS) |
| `radius.8` | 8px | `rounded-8` | 카드 (BizJAMS) |
| `radius.10` | 10px | — | 버튼 (JK CommJAMS) |
| `radius.12` | 12px | `rounded-12` | 카드 (JK CommJAMS) |
| `radius.14` | 14px | — | — |
| `radius.16` | 16px | `rounded-16` | 버튼/카드 (AM CommJAMS) |
| `radius.20` | 20px | `rounded-20` | — |
| `radius.24` | 24px | `rounded-24` | — |
| `radius.32` | 32px | — | — |
| `radius.36` | 36px | — | — |
| `radius.40` | 40px | — | — |
| `radius.48` | 48px | — | — |
| `radius.56` | 56px | — | — |
| `radius.64` | 64px | — | — |
| `radius.80` | 80px | — | — |
| `radius.999` | 999px | `rounded-999` | 필터 칩, 배지, pill 버튼 |

> ⚠️ `rounded-full` 사용 금지 → `rounded-999` 사용

### BizJAMS Radius 빠른 참조

```tsx
rounded-4    // 태그 (4px)
rounded-6    // 버튼, 인풋 (6px)
rounded-8    // 카드, 패널 (8px)
rounded-999  // 필터 칩, 뱃지
```

---

## Shadow (그림자)

> Figma JAMS 2.0 Shadow 기준 · 9 스타일

| 토큰 | CSS 값 | 용도 |
|------|--------|-----|
| `shadow.default` | `0px 4px 16px 0px rgba(0,0,0,0.07)` | 기본 그림자 |
| `shadow.secondary` | `0px 4px 16px 0px rgba(0,0,0,0.12)` | 보조 그림자 |
| `shadow.tertiary` | `0px 0px 10px 0px rgba(0,0,0,0.06)` | 3차 그림자 |
| `shadow.up` | `0px -2px 12px 0px rgba(0,0,0,0.12)` | 상단 그림자 (sticky 하단바) |
| `shadow.list` | `0px 4px 8px 0px rgba(0,0,0,0.2)` | 드롭다운, 리스트 팝업 |
| `shadow.white` | `0px 4px 20px 0px rgba(0,0,0,0.10)` | 화이트 배경 위 카드 |
| `shadow.buttonbig` | `0px 0px 12px 0px rgba(0,0,0,0.20)` | FAB, 큰 버튼 |
| `shadow.buttonsmall` | `0px 0px 8px 0px rgba(0,0,0,0.10)` | 소형 버튼 |
| `shadow.bottomsheet` | `0px -4px 12px 0px rgba(0,0,0,0.08)` | 바텀시트 |

### Tailwind 사용 패턴

```tsx
// 기본 카드
<div className="shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]">

// hover 시 그림자 강화 (shadow.secondary)
<div className="hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.12)]">

// 드롭다운
<div className="shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]">
```
