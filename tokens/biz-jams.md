# BizJAMS Tokens — B2B (워크스페어·비즈센터·HC·ATS)

> JAMS 2.1 Color를 상속하되, Space·Radius·Component를 자체 정의
> Figma: `52kVTYI3GOkjGTCZKFxZhU` (비즈센터), `uy4pUNV15IRjwQ7SL3FaO8` (HC)

---

## Primary (BizJAMS 전용)

| 역할 | DTCG 토큰 | Hex |
|------|-----------|-----|
| **Primary** | `color.blue.600` | **`#0060CC`** |
| Hover | — | `#0049A3` |
| Link | — | `#435EFF` |

> ⚠️ 기존 `#0057FF` 사용 금지 → `#0060CC`로 변경됨

## Gray (BizJAMS)

| Step | Hex | 용도 |
|------|-----|------|
| 50 | `#F7F7F7` | 배경 |
| 100 | `#F4F4F4` | 카드, 비활성 |
| 200 | `#E8E8E8` | border |
| 300 | `#D2D2D2` | 약한 stroke |
| 400 | `#BFBFBF` | Input border |
| 500 | `#9E9E9E` | 플레이스홀더 ⚠️ (기존 #999에서 변경) |
| 700 | `#6A6A6A` | 보조 텍스트 |
| 800 | `#444444` | 강조 텍스트 |
| 900 | `#222222` | 주요 텍스트 |

## B2B 전용 토큰

```
# 사이드바
color.bg.sidebar
color.bg.sidebar-active
color.text.on-sidebar

# 테이블
color.bg.table-header
color.bg.table-hover

# 데이터 시각화
color.data.1 ~ color.data.6
```

## Radius (BizJAMS — 더 각진)

| 용도 | 값 |
|------|-----|
| 태그 | 4px |
| 버튼·인풋 (`component.md`) | **6px** |
| 카드 | 8px |
| Pill | 999px |

> ⚠️ CommJAMS와 다름 — 혼용 금지

## Space (BizJAMS — compact)

데스크톱 밀도 최적화:

| 토큰 | 값 |
|------|-----|
| `space.component.md` | 10px (2.1은 12px) |
| `space.layout.sidebar` | 240px |
| chip paddingX | 16px |
| chip gap | 6px |
| chip iconSize | 14px |
| 소형 버튼/칩 높이 | 32px |
| 기본 버튼 높이 | 40px |

## Typography (BizJAMS)

| 토큰 | 크기 | 줄높이 | 굵기 |
|------|------|--------|------|
| D1 | 36px(m)/40px(d) | 48/56px | 600 |
| D2 | 32px(m)/36px(d) | 40/44px | 600 |
| H1 | 28px(m)/30px(d) | 38/40px | 600 |
| H2 | 24px | 34px | 600 |
| H3 | 20px | 28px | 600 |
| H4 | 18px | 26px | 600 |
| body-L-semibold | 16px | 24px | 600 |
| body-L-medium | 16px | 24px | 500 |
| body-L-regular | 16px | 24px | 400 |
| body-M-semibold | 14px | 20px | 600 |
| body-M-medium | 14px | 20px | 500 |
| body-M-regular | 14px | 20px | 400 |
| body-S-* | 12px | 16px | 600/500/400 |
| metric-L/M/S | 28/24/16px | 38/34/24px | 600 |

> ⚠️ 기존 `size14-bold`(weight:700) → `body-M-semibold`(weight:600)

## 레이아웃 (1440px 기준)

```
비즈센터 구조: D-BZWHeader (48px) + D-BZWSider (64px) + Body (1376px)
HC 인재 테이블: gridTemplateColumns: '180px 1fr 1fr 200px 240px'
ProposeDrawer: width 480px
```

## 이름 마스킹 (필수)

```
accepted 상태 → 전체 이름 노출 (김도진)
그 외 모든 상태 → 성** 처리 (김**)
```

## QA 체크리스트

- [ ] `tokens.color.primary` = `#0060CC` (기존 `#0057FF` 아님)
- [ ] `gray500` = `#9E9E9E` (기존 `#999` 아님)
- [ ] Heading fontWeight **600** (700 금지)
- [ ] `body-M-bold` 없음 → `body-M-semibold` 사용
- [ ] 이름 마스킹 적용
- [ ] 테이블: `gridTemplateColumns` (flex 금지)
