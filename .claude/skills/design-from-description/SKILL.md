---
name: design-from-description
description: |
  텍스트 설명만으로 React 19 + Tailwind v3 + JDS 기반 UI를 즉시 생성하는 스킬.
  Figma 없이도 동작. 창의적 레이아웃 설계 + JDS 규칙 준수.

  MANDATORY TRIGGERS:
  '화면 만들어', '대시보드 만들어', '인터페이스 제작', '페이지 만들어',
  'UI 만들어줘', '컴포넌트 만들어줘', '디자인해줘', '레이아웃 만들어',
  '랜딩 페이지', '설정 패널', '목록 화면', '상세 화면' 언급 시 반드시 트리거.

  Figma URL이 없어도 실행. 설명만으로 완성된 컴포넌트 생성.
---

# Design from Description 스킬

텍스트 설명 → 완성된 React UI. Figma 없이 동작하는 창의적 UI 생성 스킬입니다.

## 참조 문서 (작업 전 반드시 읽기)

- 디자인 시스템: `.claude/docs/design-system.md`
- 디자인 패턴: `.claude/docs/design-patterns.md`
- 기술 스택: `.claude/docs/tech-stack.md`

## 에이전트 로딩

이 스킬이 활성화되면 다음 에이전트 파일을 먼저 읽으세요:
- `.claude/agents/design-from-description.md`
- `.claude/agents/designer-creative.md` (기본 페르소나)

요청에 "가이드대로" / "JDS 규칙대로" 명시 시:
- `.claude/agents/designer-systematic.md`로 전환

## 실행 순서

1. **인텐트 파악** — 어떤 화면인지, 누가 쓰는지, 무슨 데이터가 보이는지
2. **레이아웃 선택** — `visual-design-patterns.md`에서 패턴 선택
3. **컴포넌트 매핑** — JDS 컴포넌트로 치환 가능한 요소 파악
4. **코드 생성** — React 19 + Tailwind v3 기준
5. **Mock 데이터** — 현실적인 채용 도메인 데이터 포함

## 질문 (필요 시만)

아래 정보가 없으면 간단히 확인:
- 브랜드: 잡코리아(파랑) / 알바몬(주황) / BizJAMS(HC)
- 핵심 목적: 이 화면에서 사용자가 하는 가장 중요한 행동 1가지

나머지는 창의적으로 판단하여 바로 생성.

## 아웃풋 기준

- React 19 + Tailwind CSS v3
- `@jds/theme` 컴포넌트 (Button, TextField, Tabs, Dialog 등)
- Tailwind 커스텀 스케일 (gap-4=4px, rounded-999, text-14)
- Mock 데이터 포함한 완성된 컴포넌트
- 배럴 파일(index.ts) 금지
