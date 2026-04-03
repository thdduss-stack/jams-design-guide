# JAMS Core → 2.1 마이그레이션 가이드

> JAMS Core는 폐기됨. 기존 코드 수정 시에만 접촉. 신규 코드 작성 금지.
> 출처: [Discussion #2](https://github.com/coololivia/jams-design-system/discussions/2)

---

## 레거시 → 신규 매핑표

| 레거시 값 | CommJAMS 대체 | BizJAMS 대체 |
|-----------|---------------|--------------|
| `#1563F5` (구 brand) | `palette.jk[500]` `#1B55F6` | `tokens.color.primary` `#0060CC` |
| `#0057FF` | — | `tokens.color.primary` `#0060CC` ⚠️ |
| `#222222`, `#171717` | `palette.gray[950]` `#1A1A1E` | `tokens.color.text` `#222222` |
| `#666`, `#555` | `palette.gray[600]` | `tokens.color.textSecondary` |
| `#999` (gray500) | `palette.gray[500]` `#949BA8` | `tokens.color.textDescription` `#9E9E9E` |
| `fontWeight: 700` (Heading) | `fontWeight.semibold` (600) | `fontWeight.semibold` (600) |
| `border-radius: 4px` (카드) | `radius[12]` | `radius[8]` |
| `#ddd`, `#e0e0e0` (border) | `palette.gray[200]` | `tokens.color.border` |
| `#f5f5f5` (배경) | `palette.gray[50]` | `palette.gray[50]` |

## 주요 변경사항 (2026-04-02 확정)

| # | 변경 | 상태 |
|---|------|------|
| 1 | BizJAMS primary `#0057FF` → `#0060CC` | ⚠️ 코드 반영 필요 |
| 2 | JK Dark Primary `#4C7AFB` → `#5580FF` | ⚠️ 반영 필요 |
| 3 | AM Dark Primary `#F58C4B` → `#FF8D30` | ⚠️ 반영 필요 |
| 4 | BizJAMS gray500 `#999` → `#9E9E9E` | ✅ 수정됨 |
| 5 | Heading fontWeight 700 → 600 | ✅ 수정됨 |
| 6 | `theme-jk-light` → `theme-jk` 파일명 변경 | ✅ 완료 |
| 7 | `semantic-dark.tokens.json` 신설 (neutral 14개 분리) | ✅ 완료 |

## 마이그레이션 체크리스트

- [ ] 프로젝트 내 `#1563F5`, `#0057FF` 검색 → 대체
- [ ] `#222222`, `#171717` → 토큰 참조로 교체
- [ ] `fontWeight: 700` → `fontWeight.semibold`(600) 교체
- [ ] `border-radius: 4px` (카드) → 시스템별 올바른 radius 적용
- [ ] 하드코딩된 hex 값 → 토큰 import로 전환
- [ ] `theme-jk-light` / `theme-am-light` 참조 → `theme-jk` / `theme-am`으로 변경
