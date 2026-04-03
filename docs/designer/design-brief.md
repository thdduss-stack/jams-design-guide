# JAMS 디자인 시스템 — 설계팀 가이드

> 최종 확인: 2026-04-03
> 기준 소스: https://coololivia.github.io/jams-design-system/
> 시각적 레퍼런스: [Design System Pages](https://coololivia.github.io/jams-design-system/)

---

## 시스템 구성 한눈에 보기

| 시스템 | 제품 | 특징 |
|--------|------|------|
| **JAMS 2.1** | 전체 기준 (canonical) | Color·Space·Component 소유 |
| **CommJAMS** | 잡코리아·알바몬·파트너·임베디드 | JAMS 2.1 그대로, JK/AM 테마 선택 |
| **BizJAMS** | 워크스페어·비즈센터·HC·ATS (B2B) | Space·Radius·Component 자체 정의 |
| ~~JAMS Core~~ | ~~레거시~~ | ~~폐기 — 신규 작업 금지~~ |

**어떤 작업에 어떤 시스템?**
- 잡코리아·알바몬 구직자 화면 → **CommJAMS**
- 워크스페어·채용담당자·HC 화면 → **BizJAMS**
- 공통 컴포넌트 (버튼, 인풋, 태그 등) → **JAMS 2.1**

---

## 색상

### Primary (테마별)

| 테마 | 기본 | Hover | Dark |
|------|------|-------|------|
| CommJAMS JK | `#1B55F6` | `#083CCC` | `#5580FF` |
| CommJAMS AM | `#FF6D12` | `#DA5400` | `#FF8D30` |
| BizJAMS | `#0060CC` | `#0049A3` | — |

### Gray Scale

| 단계 | Hex | 주요 용도 |
|------|-----|----------|
| Gray 50 | `#F1F2F3` | 페이지 배경 (Light) |
| Gray 100 | `#E6E8EA` | 카드 배경 |
| Gray 200 | `#D5D8DC` | 구분선·테두리 (Light) |
| Gray 300 | `#C2C6CD` | 비활성 테두리 |
| Gray 400 | `#AFB5BE` | 플레이스홀더 |
| Gray 500 | `#949BA8` | 보조 텍스트 |
| Gray 600 | `#768091` | 중간 텍스트 |
| Gray 700 | `#575F6C` | 테두리 (Dark) |
| Gray 900 | `#292C32` | Dark surface |
| Gray 950 | `#1A1A1E` | Dark 배경 / Light 주요 텍스트 |

### Semantic

| 역할 | Light | Dark |
|------|-------|------|
| Danger | `#EF4343` | `#EF4343` |
| Warning | `#F0B500` | `#FACC15` |
| Success | `#0DBC7C` | `#0DBC7C` |
| Violet | `#8B5CF6` | `#A78BFA` |

---

## 타이포그래피

**폰트**: Pretendard (전 시스템 공통)

### JAMS 2.1 · CommJAMS 타입 스케일

| 토큰 | 크기 | 줄높이 | 자간 | 카테고리 |
|------|------|--------|------|----------|
| display1 | 48px | 64px | -0.5px | Display |
| display2 | 36px | 46px | -0.5px | Display |
| h1 | 32px | 42px | -0.5px | Heading |
| h2 | 28px | 34px | -0.5px | Heading |
| h3 | 24px | 32px | -0.5px | Heading |
| h4 | 20px | 28px | -0.5px | Heading |
| h5 | 18px | 24px | 0 | Heading |
| b1 | 17px | 25px | 0 | Body |
| b2 | 16px | 24px | 0 | Body |
| b3 | 15px | 22px | 0 | Body |
| b4 | 14px | 20px | 0 | Body |
| c1 | 13px | 18px | 0 | Caption |
| c2 | 12px | 17px | 0 | Caption |
| c3 | 11px | 15px | 0 | Caption |

### BizJAMS 타입 스케일

| 토큰 | 크기 | 줄높이 | 비고 |
|------|------|--------|------|
| D1 | 36px(m)/40px(d) | 48/56px | |
| D2 | 32px(m)/36px(d) | 40/44px | |
| H1 | 28px(m)/30px(d) | 38/40px | |
| H2 | 24px | 34px | |
| H3 | 20px | 28px | |
| H4 | 18px | 26px | |
| Body L | 16px | 24px | Semibold·Medium·Regular |
| Body M | 14px | 20px | Semibold·Medium·Regular |
| Body S | 12px | 16px | Semibold·Medium·Regular |
| Metric L/M/S | 28/24/16px | 38/34/24px | 숫자·통계 강조 |

**굵기 규칙**
- Heading 전체: **Semibold(600)** — Bold(700) 사용 금지
- Body: Semibold / Medium / Regular 상황별 선택

---

## 간격 (Spacing)

**기준**: 2px base, 4px grid

| 토큰 | 값 | 주요 용도 |
|------|-----|----------|
| component.xs | 4px | 아이콘-텍스트 |
| component.sm | 8px | 인풋 내부 |
| component.md | 12px | 버튼 패딩 |
| component.lg | 16px | 카드 내부 |
| component.xl | 24px | 모달 내부 |
| layout.xs | 16px | 섹션 내부 |
| layout.sm | 24px | 섹션 간 |
| layout.md | 32px | 블록 간 |
| layout.lg | 48px | 페이지 섹션 간 |
| layout.xl | 64px | 페이지 상하 여백 |

---

## 모서리 (Border Radius)

| 시스템 | 버튼·인풋 (md) | 카드 | Pill |
|--------|--------------|------|------|
| CommJAMS JK | **10px** | 12px | 999px |
| CommJAMS AM | **16px** | 16px | 999px |
| BizJAMS | **6px** | 8px | 999px |
| 태그·배지 (공통) | 4px | — | 999px |

---

## 그림자

| 토큰 | 용도 |
|------|------|
| default | 기본 카드 |
| secondary | 강조 카드 (hover 시) |
| list | 드롭다운·팝업 |
| buttonbig | 큰 버튼 |
| buttonsmall | 작은 버튼 |
| bottomsheet | 바텀시트 |

---

## 버튼 시스템 (JAMS 2.1 기준)

### Variant

| Variant | 설명 | 사용 기준 |
|---------|------|----------|
| filled.primary | 채워진 주 버튼 | 페이지당 1개 권장 |
| filled.brand | Brand 색상 채움 | |
| filled.subtle | 연한 brand 채움 | |
| outlined.default | 외곽선 버튼 | filled과 병용 |
| outlined.pill | pill 형태 외곽선 | |
| borderless.default | 텍스트형 경량 버튼 | |
| icon | 아이콘 전용 (정사각) | |
| text | 배경·테두리·패딩 없음 | |
| filter | h=32px 고정 | off=outlined / on=brand filled |
| floating | 어두운 pill CTA | |

### Size

| 토큰 | 높이 |
|------|------|
| lg | 52px |
| md | 48px |
| sm | 40px |
| xs | 32px |

### 상태 처리 원칙

- **hover**: 더 진한 팔레트 스텝 사용 (투명도 방식 금지)
- **disabled**: 전용 gray 색상으로 교체 (투명도 방식 금지)
- **dark mode**: Primary는 더 밝은 스텝, Gray는 반전

---

## DTCG 토큰 네이밍 규칙

토큰 이름 구조: `카테고리.역할.변형`

**4원칙**: 카테고리가 앞에 / theme- prefix 없음 / 3단계 이내 / 의미 중심

---

## 관련 Figma 파일

| 파일 | 키 | 용도 |
|------|-----|------|
| JAMS 2.1 실험실 | `mrgHPV0VxWmqxV4C8gABgv` | JAMS 2.1 전체 |
| JAMS Core | `NiWp4FeJudLewDP3OSa0i4` | 공통 컴포넌트 |
| PC Assets (잡코리아) | `yB8Vz6IaE0H9dq2ml2gqpH` | CommJAMS 컴포넌트 |
| 메인 개편 Master | `OIDdZxo93MWXdltKdNEuyz` | CommJAMS 기준 |
| 비즈센터 홈 | `52kVTYI3GOkjGTCZKFxZhU` | BizJAMS 레이아웃 |
| HC 인재검색 | `uy4pUNV15IRjwQ7SL3FaO8` | BizJAMS 상세 |
