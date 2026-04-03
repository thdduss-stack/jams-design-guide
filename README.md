# JAMS Design Guide

> JAMS 2.1 디자인 시스템 — 설계팀 & 개발팀 통합 가이드
>
> 기준 소스: [coololivia/jams-design-system](https://github.com/coololivia/jams-design-system)
> 최종 업데이트: 2026-04-03

---

## 폴더 구조

```
jams-design-guide/
├── docs/
│   ├── designer/          ← 설계팀(디자이너)용 가이드
│   │   └── design-brief.md
│   ├── developer/         ← 개발자용 구현 가이드
│   │   ├── dev-guide.md
│   │   └── migration-guide.md
│   └── system/            ← 시스템 아키텍처 & 규칙
│       ├── architecture.md
│       ├── naming-convention.md
│       └── dark-mode.md
├── tokens/                ← 토큰 레퍼런스 (Primitives / JAMS 2.1 / BizJAMS / CommJAMS)
│   ├── primitives.md
│   ├── jams-2.1.md
│   ├── biz-jams.md
│   └── comm-jams.md
└── skill/                 ← Claude AI 스킬
    └── SKILL.md
```

## 시스템 한눈에 보기

| 시스템 | 제품 | 특징 |
|--------|------|------|
| **JAMS 2.1** | 전체 기준 (canonical) | Color·Space·Component 소유 |
| **CommJAMS** | 잡코리아·알바몬·파트너·임베디드 | JAMS 2.1 그대로, JK/AM 테마 선택 |
| **BizJAMS** | 워크스페어·비즈센터·HC·ATS (B2B) | Space·Radius·Component 자체 정의 |
| ~~JAMS Core~~ | ~~레거시~~ | ~~폐기 — 신규 작업 금지~~ |

## 누가 어떤 문서를 봐야 할까?

- **디자이너**: `docs/designer/design-brief.md` → 색상, 타이포, 컴포넌트 스펙 한눈에
- **개발자**: `docs/developer/dev-guide.md` → 코드 규칙, import, 컴포넌트 패턴
- **모두**: `docs/system/architecture.md` → 시스템 구조, 소유 규칙 이해

## 관련 링크

- GitHub Pages 뷰어: https://coololivia.github.io/jams-design-system/
- Figma (JAMS 2.1): `mrgHPV0VxWmqxV4C8gABgv`
- Figma (JAMS Core): `NiWp4FeJudLewDP3OSa0i4`
- Figma (잡코리아 PC Assets): `yB8Vz6IaE0H9dq2ml2gqpH`
- Figma (비즈센터): `52kVTYI3GOkjGTCZKFxZhU`
