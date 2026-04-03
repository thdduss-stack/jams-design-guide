# JAMS QA 체크리스트

> 출처: JAMS 디자인시스템 개발자 구현 가이드 (2026-04-03)
> 시스템별 QA 기준. `qa-checker` 에이전트에서 참조.

## 공통 (시스템 무관)

- [ ] `"use client"` — 인터랙션 있는 모든 컴포넌트 최상단 선언
- [ ] 하드코딩 없음 — 색상·크기·간격 모두 토큰 참조
- [ ] `<button>` HTML 직접 작성 금지 → JDS 컴포넌트 사용
- [ ] 폰트: Pretendard (다른 폰트 금지, Noto Sans KR 포함)
- [ ] `disabled` 상태: opacity 방식 금지 → gray 토큰 교체
- [ ] `hover` 상태: opacity 방식 금지 → 더 진한 팔레트 스텝 사용
- [ ] `page.tsx` 얇게 — 뷰 로직은 `components/`로 분리

---

## CommJAMS QA (잡코리아/알바몬)

- [ ] 임의 hex 없음 (모두 토큰 참조)
- [ ] 카드 radius: **10px** (JK) / **16px** (AM)
- [ ] 태그 높이: **20px** / fontSize: **11px** / fontWeight: **600**
- [ ] D-day 색상: **`#f37676`** (다른 빨강 사용 금지)
- [ ] 회사명 색상: **`#575f6c`** (secondary/tertiary 혼동 주의)
- [ ] GNB 검색창 border: **1.5px** (1px 아님)
- [ ] 히어로 배너 radius: **16px**
- [ ] Heading `fontWeight`: **600** (700 금지)
- [ ] `fontFamily: fontFamily.base` 명시 또는 `fontFamily: 'inherit'`

---

## BizJAMS QA (워크스페어/HC/ATS)

- [ ] `tokens.color.primary` = **`#0060CC`** (기존 `#0057FF` 아님 ⚠️)
- [ ] `gray500` = **`#9E9E9E`** (기존 `#999` 아님 ⚠️)
- [ ] Heading `fontWeight`: **600** (700 금지)
- [ ] `body-M-bold` 없음 → **`body-M-semibold`** 사용
- [ ] 이름 마스킹 적용 (`maskName()` — accepted 제외 모두 성** 처리)
- [ ] 테이블: `gridTemplateColumns` 사용 (flex 금지)
- [ ] 버튼 radius: **6px** (CommJAMS 10px와 혼용 금지)
- [ ] `"use client"` 선언
- [ ] Ant Design 6.x 호환 확인

---

## 타이포그래피 공통

- [ ] Heading 전체: `fontWeight.semibold` (600) — Bold(700) 사용 금지
- [ ] Body: `semibold` / `medium` / `regular` 상황별 선택
- [ ] `gridTemplateColumns` 선호 (flex보다 테이블 구조에 적합)

---

## Tailwind 스케일 주의사항 (이 프로젝트)

- [ ] `gap-4` = **4px** (기본 Tailwind gap-4 = 16px와 다름!)
- [ ] `rounded-999` 사용 (`rounded-full` 아님)
- [ ] `text-14` = 14px, `font-semibold` = 600

---

## 참조 문서

- 시스템 계층: `.claude/agents/docs/jams-system-overview.md`
- BizJAMS 토큰: `.claude/agents/docs/bizjams-tokens.md`
- JDS 디자인 시스템: `.claude/agents/docs/jds-design-system.md`
