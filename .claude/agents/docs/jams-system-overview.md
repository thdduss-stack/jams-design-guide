# JAMS 시스템 계층구조

> 출처: JAMS 디자인시스템 설계팀 가이드 / 개발자 구현 가이드 (2026-04-03)

## 시스템 계층

```
JAMS 2.1 (canonical) — Color·Space·Component 소유
│
├── CommJAMS — 잡코리아·알바몬·파트너·임베디드
│   테마: JK Light / AM Light
│
└── BizJAMS — 워크스페어·비즈센터·HC·ATS (B2B)
    테마: blue.600 (#0060CC)

[JAMS Core] ← 레거시 폐기. 신규 코드 작성 금지.
```

## 어느 화면에 어느 시스템?

| 키워드 | 시스템 |
|--------|--------|
| GNB, 공고카드, 히어로, 메인, Footer, 검색창, 태그 | **CommJAMS** |
| 비즈센터, HC, 인재검색, TalentCard, FilterBar, D-BZW, ATS | **BizJAMS** |
| Button, Input, Tag, Card, Modal 순수 공통 | **JAMS 2.1** |

→ **이 프로젝트(jk-hiringcenter-design-web)**: HC 채용담당자 화면 → **BizJAMS**

## Primary 색상 (테마별)

| 테마 | 기본 | Hover | Dark |
|------|------|-------|------|
| CommJAMS JK | `#1B55F6` | `#083CCC` | `#5580FF` |
| CommJAMS AM | `#FF6D12` | `#DA5400` | `#FF8D30` |
| **BizJAMS** | **`#0060CC`** | **`#0049A3`** | — |

> ⚠️ BizJAMS Primary = `#0060CC`. `#0057FF` 사용 금지. `#1B55F6`(CommJAMS)와 혼용 금지.

## Border Radius (시스템별)

| 시스템 | 버튼·인풋 (md) | 카드 | Pill |
|--------|--------------|------|------|
| CommJAMS JK | **10px** (`radius[10]`) | 12px | 999px |
| CommJAMS AM | **16px** (`radius[16]`) | 16px | 999px |
| **BizJAMS** | **6px** (`tokens.radius.sm`) | 8px (`tokens.radius.md`) | 999px |
| 태그·배지 공통 | 4px | — | 999px |

> ⚠️ CommJAMS와 BizJAMS radius 혼용 금지. BizJAMS가 더 각짐.

## 버튼 Variant (JAMS 2.1 기준)

| Variant | 설명 | 사용 기준 |
|---------|------|---------|
| `filled.primary` | 채워진 주 버튼 | 페이지당 1개 권장 |
| `filled.brand` | Brand 색상 채움 | |
| `filled.subtle` | 연한 brand 채움 | |
| `outlined.default` | 외곽선 | filled과 병용 |
| `outlined.pill` | pill 형태 외곽선 | |
| `borderless.default` | 텍스트형 경량 | |
| `icon` | 아이콘 전용 (정사각) | |
| `filter` | h=32px 고정 | off=outlined / on=brand filled |
| `floating` | 어두운 pill CTA | |

## 버튼 Size

| 토큰 | 높이 | 용도 |
|------|------|------|
| `lg` | 52px | |
| `md` | 48px | |
| `sm` | 40px | 기본 버튼 |
| `xs` | 32px | 소형 버튼, 필터 칩 |

## 상태 처리 원칙

- **hover**: 더 진한 팔레트 스텝 사용 (투명도 방식 금지)
- **disabled**: 전용 gray 색상으로 교체 (투명도 방식 금지)
- **dark mode**: Primary는 더 밝은 스텝, Gray는 반전

## 관련 Figma 파일

| 파일 | 키 | 시스템 |
|------|-----|--------|
| JAMS Core | `NiWp4FeJudLewDP3OSa0i4` | JAMS 2.1 |
| PC Assets (잡코리아) | `yB8Vz6IaE0H9dq2ml2gqpH` | CommJAMS |
| 메인 개편 Master | `OIDdZxo93MWXdltKdNEuyz` | CommJAMS |
| 비즈센터 홈 | `52kVTYI3G0kjGTCZKFxZhU` | BizJAMS |
| HC 인재검색 | `uy4pUNV15IRjwQ7SL3FaO8` | BizJAMS |

## DTCG 토큰 네이밍 4원칙

1. 카테고리가 앞에
2. `theme-` prefix 없음
3. 3단계 이내
4. 의미 중심 (시각적 역할이 이름에서 보여야 함)

```
color.bg.interactive         ← 버튼 primary 배경
color.bg.interactive-hover   ← hover 상태
color.text.primary           ← 주요 텍스트
color.border.default         ← 기본 테두리
radius.component.md          ← 버튼·인풋 기본 radius
space.component.lg           ← 카드 내부 padding
```

## JAMS Core 마이그레이션 (레거시 처리)

> 기존 코드 수정 시에만 접촉. 신규 코드 작성 금지.

| 레거시 값 | CommJAMS 대체 | BizJAMS 대체 |
|----------|-------------|-------------|
| `#1563F5` (구 brand) | `palette.jk[500]` #1B55F6 | `tokens.color.primary` #0060CC |
| `#0057FF` | — | `tokens.color.primary` #0060CC ⚠️ |
| `#222222`, `#171717` | `palette.gray[950]` #1A1A1E | `tokens.color.text` #222222 |
| `#666`, `#555` | `palette.gray[600]` | `tokens.color.textSecondary` |
| `fontWeight: 700` (Heading) | `fontWeight.semibold` (600) | `fontWeight.semibold` (600) |
| `border-radius: 4px` (카드) | `radius[12]` | `radius[8]` |
