# JAMS 타이포그래피 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Typography 탭)
> 폰트: Pretendard (기본), JetBrains Mono (코드)

## Font Family

| 토큰 | 값 |
|------|----|
| `font-family.sans` | Pretendard, -apple-system, system-ui, sans-serif |
| `font-family.mono` | JetBrains Mono, Menlo, Consolas, monospace |

## Font Weight

| 토큰 | 값 | Tailwind |
|------|-----|---------|
| `typography.font-weight.regular` | 400 | `font-regular` |
| `typography.font-weight.medium` | 500 | `font-medium` |
| `typography.font-weight.semibold` | 600 | `font-semibold` |
| `typography.font-weight.bold` | 700 | `font-bold` |

## Type Scale

### Display

| 토큰 | Size | Line Height | Letter Spacing | Tailwind |
|------|------|------------|---------------|---------|
| `typography.styles.display1` | 48px | 64px | 0.5px | — (커스텀 없음) |
| `typography.styles.display2` | 36px | 46px | 0.5px | `text-36` |

### Heading

| 토큰 | Size | Line Height | Letter Spacing | Tailwind |
|------|------|------------|---------------|---------|
| `typography.styles.h1` | 32px | 42px | 0.5px | `text-32` |
| `typography.styles.h2` | 28px | 34px | 0.5px | `text-28` |
| `typography.styles.h3` | 24px | 32px | 0.5px | `text-24` |
| `typography.styles.h4` | 20px | 28px | 0.5px | `text-20` |
| `typography.styles.h5` | 18px | 24px | 0px | `text-18` |

> ⚠️ Display/Heading (h1~h4): `letter-spacing: 0.5px`
> ⚠️ H5 이하: `letter-spacing: 0px`

### Body

| 토큰 | Size | Line Height | Letter Spacing | Tailwind |
|------|------|------------|---------------|---------|
| `typography.styles.b1` | 17px | 25px | 0px | — (없음, `text-16` 또는 `text-18` 근사) |
| `typography.styles.b2` | 16px | 24px | 0px | `text-16` |
| `typography.styles.b3` | 15px | 22px | 0px | `text-15` |
| `typography.styles.b4` | 14px | 20px | 0px | `text-14` |

### Caption

| 토큰 | Size | Line Height | Letter Spacing | Tailwind |
|------|------|------------|---------------|---------|
| `typography.styles.c1` | 13px | 18px | 0px | `text-13` |
| `typography.styles.c2` | 12px | 17px | 0px | `text-12` |
| `typography.styles.c3` | 11px | 15px | 0px | `text-11` |

---

## HC 프로젝트 실제 사용 패턴

> BizJAMS HC 기준 — `bizjams-tokens.md` 참조

```typescript
// 페이지/섹션 제목
text-20 font-semibold    // H3 상당 (BizJAMS)
text-18 font-semibold    // H4 상당

// 본문 주요 텍스트
text-16 font-semibold    // body-L-semibold
text-14 font-semibold    // body-M-semibold (테이블 헤더, 라벨)
text-14 font-medium      // body-M-medium (이름, 학력)
text-14 font-regular     // body-M-regular (날짜, 일반)

// 보조/설명
text-13 font-regular     // caption-M
text-12 font-regular     // caption-S

// 숫자/통계 (대시보드)
text-28 font-semibold    // metric-L
```

## Letter Spacing 규칙 요약

```
Display, H1~H4  → letter-spacing: 0.5px
H5, Body, Caption → letter-spacing: 0px
```

## 이 프로젝트 Tailwind 스케일 (전체)

```
text-11  text-12  text-13  text-14  text-15  text-16
text-18  text-20  text-24  text-28  text-32  text-36
```

> `text-17` `text-48` 없음 — JAMS b1(17px), display1(48px)는 Tailwind 스케일 밖
> → 이 프로젝트에서는 `text-16` / `text-18`로 근사값 사용
