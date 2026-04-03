# CommJAMS 토큰 — B2C 전용

> 잡코리아·알바몬·파트너·임베디드 서비스
> JAMS 2.1 색상·간격을 그대로 상속하고, JK/AM 테마만 선택

---

## CommJAMS 전용 색상

| 용도 | JK | AM |
|------|----|----|
| Primary | `#1B55F6` | `#FF6D12` |
| Hover | `#083CCC` | `#DA5400` |
| Light bg | `#F0F2FA` | `#FBF4EF` |
| Dark Primary | `#5580FF` | `#FF8D30` |
| D-day 색상 | `#F37676` | `#F37676` |

## CommJAMS Radius

| 요소 | JK | AM |
|------|----|----|
| 버튼·인풋 (md) | **10px** | **16px** |
| 카드 | 10px | 16px |
| 태그·배지 | 4px | 4px |
| Pill | 999px | 999px |

## CommJAMS 픽셀 스펙

### GNB
- 높이: 64px (PC), 56px (M)
- 검색 입력 border: **1.5px** solid
- 로고: JK / AM 로고 SVG

### 공고 카드
- border-radius: **10px** (JK) / **16px** (AM)
- padding: 12px 16px
- border: 1px solid gray.100
- 내부: 로고 → 공고명(17px 600) → 회사명+D-day → 태그 row

### 태그 (20px 고정)
- height: **20px**
- padding: 2px 6px
- border-radius: 4px
- fontSize: 11px
- fontWeight: 600

## CommJAMS 허용 컴포넌트

JAMS 2.1에서 가져오는 공통 컴포넌트:
- Button (모든 variant)
- Input / TextArea
- Tag / Badge
- Card
- Modal / Dialog
- Tooltip / Popover
- Tab / Pagination

## CommJAMS QA 체크리스트

- [ ] JK/AM 테마 전환 시 Primary 색상 올바른지
- [ ] 카드 radius가 JK=10px / AM=16px인지
- [ ] 태그 높이 20px 고정인지
- [ ] GNB 검색 border 1.5px인지
- [ ] D-day 색상 `#F37676`인지
- [ ] Heading fontWeight 600인지 (700 아닌지)
- [ ] Dark mode에서 Primary가 400 스텝인지
