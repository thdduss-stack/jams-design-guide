# Primitive Tokens — 순수 값

> 출처: [TOKENS-PRIMITIVES.md](https://github.com/coololivia/jams-design-system/blob/main/docs/TOKENS-PRIMITIVES.md)
> 모든 시스템(JAMS 2.1, CommJAMS, BizJAMS)이 공유하는 raw 값

---

## Color Palette

### JK Blue (JKblue) — 잡코리아 브랜드

| Step | Hex |
|------|-----|
| 50 | `#F0F2FA` |
| 100 | `#E1E7FA` |
| 200 | `#C6D4FA` |
| 300 | `#96B1FD` |
| 400 | `#5580FF` |
| **500** | **`#1B55F6`** |
| 600 | `#083CCC` |
| 700 | `#012CA2` |
| 900 | `#001757` |

### AM Orange — 알바몬 브랜드

| Step | Hex |
|------|-----|
| 50 | `#FBF4EF` |
| 100 | `#FFDDCC` |
| 200 | `#FFBC99` |
| 300 | `#FF9B66` |
| 400 | `#FF8D30` |
| **500** | **`#FF6D12`** |
| 600 | `#DA5400` |
| 700 | `#B44000` |
| 900 | `#6B2400` |

### Gray

| Step | Hex | 주요 용도 |
|------|-----|----------|
| 50 | `#F1F2F3` | 페이지 배경 (Light) |
| 100 | `#E6E8EA` | 카드 배경 |
| 200 | `#D5D8DC` | 구분선·테두리 (Light) |
| 300 | `#C2C6CD` | 비활성 테두리 |
| 400 | `#AFB5BE` | 플레이스홀더 |
| 500 | `#949BA8` | 보조 텍스트 |
| 600 | `#768091` | 중간 텍스트 |
| 700 | `#575F6C` | 테두리 (Dark) |
| 800 | `#3E434B` | 보조 텍스트 (Dark) |
| 900 | `#292C32` | Dark surface |
| 950 | `#1A1A1E` | Dark 배경 / Light 주요 텍스트 |

### Blue (시스템 블루 — BizJAMS primary)

| Step | Hex |
|------|-----|
| 400 | `#4C93FF` |
| 500 | `#207CF4` |
| **600** | **`#0060CC`** |
| 700 | `#0049A3` |

### Semantic Colors

| 이름 | Hex | 용도 |
|------|-----|------|
| Red 500 | `#FC3B3B` | Error / Danger |
| Yellow 500 | `#F0B500` | Warning |
| Green 500 | `#0DBC7C` | Success |
| Violet 500 | `#8B5CF6` | Accent / Special |

---

## Spacing (4px grid)

```
0   1   2   4   6   8   10  12  14  16
18  20  24  32  36  40  48  56  64  80
```

| 용도 | 권장 값 |
|------|--------|
| 아이콘-텍스트 간격 | 4~8px |
| 인풋 내부 | 8px |
| 버튼 패딩 | 12px |
| 카드 내부 | 16~24px |
| 모달 내부 | 24px |
| 섹션 간 | 32~48px |
| 페이지 섹션 간 | 48~64px |

---

## Border Radius

| 값 | 용도 |
|-----|------|
| 0px | 없음 |
| 2px | 극소형 |
| 4px | 태그·배지 |
| 6px | BizJAMS 버튼·인풋 |
| 8px | JAMS 2.1 기본 |
| 10px | CommJAMS JK 버튼·인풋 |
| 12px | 카드 |
| 16px | CommJAMS AM 버튼·인풋, 모달 |
| 20px | 대형 컨테이너 |
| 24px | 특대형 |
| 999px | Pill (완전 둥근) |

---

## Typography

### Font Family

- **기본**: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif
- **코드**: JetBrains Mono, monospace

### Font Weight

| 이름 | 값 | 용도 |
|------|-----|------|
| Regular | 400 | 일반 본문 |
| Medium | 500 | 중간 강조 |
| **SemiBold** | **600** | **제목, 버튼 (Heading 기본)** |
| Bold | 700 | 강한 강조 (CommJAMS 히어로 예외만) |

> ⚠️ Heading은 반드시 SemiBold(600). Bold(700) 사용 금지.

### Type Scale

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

---

## Shadow

| 토큰 | 값 | 용도 |
|------|-----|------|
| default | `0 4px 16px rgba(0,0,0,0.07)` | 기본 카드 |
| secondary | `0 4px 16px rgba(0,0,0,0.12)` | 강조 카드 (hover) |
| tertiary | `0 0 10px rgba(0,0,0,0.06)` | 약한 그림자 |
| list | `0 4px 8px rgba(0,0,0,0.20)` | 드롭다운·팝업 |
| white | `0 4px 20px rgba(0,0,0,0.10)` | 흰 배경 위 |
| buttonbig | `0 0 12px rgba(0,0,0,0.20)` | Primary 버튼 |
| buttonsmall | `0 0 8px rgba(0,0,0,0.10)` | Secondary 버튼 |
| bottomsheet | `0 -4px 12px rgba(0,0,0,0.08)` | 바텀시트 |
| up | `0 -2px 12px rgba(0,0,0,0.12)` | 상단 열림 요소 |

---

## Opacity

| 토큰 | 값 | 용도 |
|------|-----|------|
| opacity.dimmed | 0.6 | 딤드 배경 |
| opacity.disabled | 0.38 | 비활성 상태 |
| opacity.hover | 0.08 | hover 오버레이 |

## Motion / Duration

| 토큰 | 값 | 용도 |
|------|-----|------|
| duration.fast | 150ms | 버튼, 토글 |
| duration.normal | 250ms | 모달, 드로어 |
| duration.slow | 350ms | 페이지 전환 |
