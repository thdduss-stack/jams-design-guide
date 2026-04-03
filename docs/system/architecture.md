# JAMS 디자인 시스템 아키텍처

> 확정일: 2026-04-02
> 출처: [Discussion #9](https://github.com/coololivia/jams-design-system/discussions/9)

---

## 시스템 구성

| 시스템 | 용도 | Color | Space/Radius/Component |
|--------|------|-------|------------------------|
| **Shared Primitives** | raw 값 전체 | 정의 | 정의 |
| **JAMS 2.1** | B2C canonical | 소유·정의 | 소유·정의 |
| **BizJAMS** | B2B | 2.1 상속 | 자체 정의 |
| **CommJAMS** | 커뮤니티·파트너·임베디드 | 2.1 상속 | 2.1 그대로 (서브셋) |
| ~~JAMS Core~~ | ~~레거시~~ | ~~폐기~~ | — |

## 구조 다이어그램

```
Shared Primitives (color.*, spacing.*, radius.*)
        │
        ▼
   JAMS 2.1 ──────────────────────────────────┐
   Color + Space 소유·정의                       │ 상속
        │                                       │
        ├──────────────────┐                    │
        ▼                  ▼                    ▼
    BizJAMS            CommJAMS
    Color: 상속          Color: 상속
    Space: 자체          Space: 2.1 그대로
    Radius: 자체         Radius: 2.1 그대로
    Component: 자체      Component: 2.1 서브셋
    테마: blue.600       테마: JK Light / AM Light
```

## 소유 규칙

### Color
- **JAMS 2.1이 정의**. 다른 시스템은 brand 색상만 override
- BizJAMS primary: `color.blue.600` = `#0060CC`
- CommJAMS: JK(`#1B55F6`) 또는 AM(`#FF6D12`) 테마 선택

### Space
- **JAMS 2.1이 정의**
- BizJAMS: 데스크톱 밀도용 자체 스케일 (더 compact)
- CommJAMS: 2.1 그대로

### Radius
- **JAMS 2.1이 정의**
- BizJAMS: 더 각진 — `radius.component.md` = **6px**
- CommJAMS JK: `md=10px` / AM: `md=16px`

### Component
- **JAMS 2.1이 정의**
- BizJAMS: 자체 정의 (B2B 전용 컴포넌트 포함)
- CommJAMS: allowed 목록으로 허용 컴포넌트 제한

## 어떤 작업에 어떤 시스템?

| 키워드 | 시스템 |
|--------|--------|
| 잡코리아, 알바몬, 메인, GNB, 공고카드 | **CommJAMS** |
| 비즈센터, HC, 인재검색, ATS | **BizJAMS** |
| Button, Input, Tag (순수 공통) | **JAMS 2.1** |

## 관련 Figma 파일

| 파일 | 키 | 시스템 |
|------|-----|--------|
| JAMS 2.1 실험실 | `mrgHPV0VxWmqxV4C8gABgv` | JAMS 2.1 |
| PC Assets (잡코리아) | `yB8Vz6IaE0H9dq2ml2gqpH` | CommJAMS |
| 비즈센터 홈 | `52kVTYI3GOkjGTCZKFxZhU` | BizJAMS |
| HC 인재검색 | `uy4pUNV15IRjwQ7SL3FaO8` | BizJAMS |
