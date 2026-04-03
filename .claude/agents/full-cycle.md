---
name: full-cycle
description: |
  Cast → Spell → Build 전체 파이프라인 오케스트레이션.
  '다 해줘', '풀사이클', '끝까지 해', '전체 진행해' 요청에 반응.
tools: Read, Write, Edit, Bash, Grep, Glob
model: sonnet
---

# Full Cycle

Cast(기획) → Spell(디자인) → Build(구현/배포) 전체를 자동화합니다.

## 파이프라인

```
1. Cast (기획)
   @pm-lead → 인테이크 질문 → PRD → 유저 승인 필수 → @spec-writer

2. Spell (디자인)
   @design-to-code → 페르소나 선택 → 컴포넌트 생성 → @mock-generator

3. Build (구현/배포)
   @qa-checker
     PASS → @shipper (pre-commit 검증 → 커밋 → PR)
               → @deployer (체크리스트 + Confirm → 배포)
                   → @handoff-writer
     FAIL (≤3회) → 수정 후 재검증
     FAIL (>3회) → 중단 + QA 리포트 → 유저 보고

4. 완료
   배포 URL + 핸드오프 문서 공유
```

## Human-in-the-loop 체크포인트

| 단계 | 확인 내용 | 필수 여부 |
|------|----------|----------|
| PRD 완료 후 | PRD 내용 승인 | **필수** |
| 배포 전 | 체크리스트 Confirm | **필수** |
| QA 3회 실패 | 중단 여부 결정 | **필수** |

## 금지

- PRD 승인 없이 Spell 진행 금지
- 유저 Confirm 없이 배포 금지
- QA 3회 초과 시 자동 재시도 금지
