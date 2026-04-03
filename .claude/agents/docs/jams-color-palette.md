# JAMS 컬러 팔레트 레퍼런스

> 출처: https://coololivia.github.io/jams-design-system/ (Color 탭)
> 8개 팔레트 × 11 스텝 = 88 컬러

## Primitive Palette

### Gray (중립 / 텍스트 / 배경)
| Step | Hex | 주요 용도 |
|------|-----|----------|
| 50 | `#F4F6F7` | 페이지 배경, surface |
| 100 | `#E2E6E8` | 비활성 배경 |
| 200 | `#D1D6DA` | border.default |
| 300 | `#B8BFC5` | text.tertiary (dark) |
| 400 | `#9EA8AF` | — |
| 500 | `#86919A` | text.tertiary (light) |
| 600 | `#636C74` | text.secondary |
| 700 | `#484F56` | border.default (dark) |
| 800 | `#30363C` | surface (dark) |
| 900 | `#1E2428` | bg.surface (dark) |
| 950 | `#131618` | bg.base (dark) / text.primary (light) |

### Blue (BizJAMS Brand)
| Step | Hex |
|------|-----|
| 50 | `#EBF5FF` |
| 100 | `#CCE4FF` |
| 200 | `#A4CEFF` |
| 300 | `#70B0FF` |
| 400 | `#4598FF` |
| **500** | **`#2684FF`** ← BizJAMS Primary (Light) |
| **600** | **`#0060CC`** ← BizJAMS Primary (구 Biz 기준) |
| 700 | `#00469A` |
| 800 | `#002F6E` |
| 900 | `#001C46` |
| 950 | `#000E24` |

### Blue2 (CommJAMS JK Brand)
| Step | Hex |
|------|-----|
| 50 | `#EEF3FF` |
| 100 | `#D5E4FF` |
| 200 | `#AECCFF` |
| 300 | `#82AAFF` |
| **400** | **`#5580FF`** ← JK Dark Primary |
| **500** | **`#1B55F6`** ← CommJAMS JK Primary (Light) |
| 600 | `#1240CC` |
| 700 | `#0D2EA0` |
| 800 | `#091F74` |
| 900 | `#06124A` |
| 950 | `#030926` |

### Orange (CommJAMS AM Brand)
| Step | Hex |
|------|-----|
| 50 | `#FFF6EE` |
| 100 | `#FFE8CC` |
| 200 | `#FFD09A` |
| 300 | `#FFAB5E` |
| **400** | **`#FF8D30`** ← AM Dark Primary |
| **500** | **`#FF6D12`** ← CommJAMS AM Primary (Light) |
| 600 | `#CC4D00` |
| 700 | `#9A3600` |
| 800 | `#6C2200` |
| 900 | `#421200` |
| 950 | `#230800` |

### Red (에러 / 위험)
| Step | Hex |
|------|-----|
| 50 | `#FFF2F1` |
| 100 | `#FFD9D6` |
| 200 | `#FFB4B0` |
| 300 | `#F98880` |
| 400 | `#F05C55` |
| **500** | **`#F22A23`** ← Error |
| 600 | `#B8201A` |
| 700 | `#8C1210` |
| 800 | `#630808` |
| 900 | `#3D0403` |
| 950 | `#210102` |

### Green (성공)
| Step | Hex |
|------|-----|
| 50 | `#EEFFF6` |
| 100 | `#C4F5DF` |
| 200 | `#88E8BA` |
| 300 | `#4AD898` |
| 400 | `#1BC478` |
| **500** | **`#02B160`** ← Success |
| 600 | `#038548` |
| 700 | `#015F30` |
| 800 | `#003D1E` |
| 900 | `#00240E` |
| 950 | `#001307` |

### Yellow (경고)
| Step | Hex |
|------|-----|
| 50 | `#FFFCE8` |
| 100 | `#FFF5CC` |
| 200 | `#FFE87A` |
| 300 | `#FFDA36` |
| 400 | `#FFC821` |
| **500** | **`#FFBB00`** ← Warning |
| 600 | `#CC8800` |
| 700 | `#9A5E00` |
| 800 | `#6C3E00` |
| 900 | `#332500` |
| 950 | `#231100` |

### Violet (보조 강조)
| Step | Hex |
|------|-----|
| 50 | `#F5F3FF` |
| 100 | `#EDE8FF` |
| 200 | `#D8CDFF` |
| 300 | `#BBA4FF` |
| 400 | `#9D6EF8` |
| **500** | **`#7C3AED`** ← Violet Primary |
| 600 | `#5E20C5` |
| 700 | `#451496` |
| 800 | `#2E0C6A` |
| 900 | `#1D004F` |
| 950 | `#0E0224` |

---

## Semantic 색상 (테마별)

### CommJAMS JK (잡코리아)

| 역할 | Light | Dark |
|------|-------|------|
| Primary | `blue2.500` = `#1B55F6` | `blue2.400` = `#5580FF` |
| Primary Hover | `blue2.600` = `#1240CC` | `blue2.300` = `#82AAFF` |
| Primary Active | `blue2.700` = `#0D2EA0` | `blue2.200` = `#AECCFF` |
| bg.brand-subtle | `blue2.50` = `#EEF3FF` | `blue2.900` = `#06124A` |
| border.brand-subtle | `blue2.200` = `#AECCFF` | `blue2.700` = `#0D2EA0` |

### CommJAMS AM (알바몬)

| 역할 | Light | Dark |
|------|-------|------|
| Primary | `orange.500` = `#FF6D12` | `orange.400` = `#FF8D30` |
| Primary Hover | `orange.600` = `#CC4D00` | `orange.300` = `#FFAB5E` |
| Primary Active | `orange.700` = `#9A3600` | `orange.200` = `#FFD09A` |

### BizJAMS (HC)

| 역할 | Light | Dark |
|------|-------|------|
| Primary | `blue.500` = `#2684FF` | `blue.400` = `#4598FF` |
| Primary Hover | `blue.600` = `#0060CC` | `blue.300` = `#70B0FF` |
| Primary Active | `blue.700` = `#00469A` | `blue.200` = `#A4CEFF` |

### 공통 시멘틱 (Light)

| 역할 | 토큰 | 값 |
|------|------|----|
| text.primary | `gray.950` | `#131618` |
| text.secondary | `gray.600` | `#636C74` |
| text.tertiary | `gray.500` | `#86919A` |
| bg.base | `white` | `#FFFFFF` |
| bg.surface | `gray.50` | `#F4F6F7` |
| bg.surface-hover | `gray.100` | `#E2E6E8` |
| border.default | `gray.200` | `#D1D6DA` |
| bg.interactive-disabled | `gray.100` | `#E2E6E8` |
| text.disabled | `gray.300` | `#B8BFC5` |

### 공통 시멘틱 (Dark)

| 역할 | 토큰 | 값 |
|------|------|----|
| text.primary | `gray.50` | `#F4F6F7` |
| text.secondary | `gray.300` | `#B8BFC5` |
| text.tertiary | `gray.500` | `#86919A` |
| bg.base | `gray.950` | `#131618` |
| bg.surface | `gray.900` | `#1E2428` |
| bg.surface-hover | `gray.800` | `#30363C` |
| border.default | `gray.700` | `#484F56` |

---

## 다크모드 로직

Gray scale 중간점 기준:
- **Light Mode**: `gray.600` ~ `gray.950` → 텍스트/아이콘 (어두운 색)
- **Dark Mode**: `gray.50` ~ `gray.400` → 텍스트/아이콘 (밝은 색)
- `gray.500` = 구분점 (Light tertiary = Dark tertiary)

---

## Tailwind 클래스 매핑

이 프로젝트는 CSS 변수 기반이므로 Tailwind semantic 클래스 사용:

```
text-typography-primary     → gray.950 (light) / gray.50 (dark)
text-typography-secondary   → gray.600 (light) / gray.300 (dark)
text-typography-disabled    → gray.300 (light) / gray.700 (dark)
border-line-normal          → gray.200 (light) / gray.700 (dark)
bg-box-normal               → gray.50  (light) / gray.900 (dark)
bg-button-primary           → 브랜드별 Primary
```

> ⚠️ HEX 직접 사용 금지 — 반드시 시멘틱 토큰 또는 Tailwind 클래스 사용
