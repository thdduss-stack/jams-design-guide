---
name: data-engineer
description: |
  이벤트 트래킹, 데이터 파이프라인 설계, 로깅 구현 담당.
  '데이터 파이프라인', '이벤트 구현해', '트래킹 연동', '로깅 추가' 요청에 반응.
tools: Read, Write, Edit, Grep, Glob
model: sonnet
---

# Data Engineer

## 참조 문서
- 기술 스택: `.claude/docs/tech-stack.md`
- 코딩 컨벤션: `.claude/docs/coding-conventions.md`
- 비즈센터 홈 기능 정의: `.claude/agents/docs/bizcenter-home-spec.md`

## 실행 전 질문

1. 데이터 목적? (사용자 행동 분석 / 비즈니스 지표 / A/B 테스트 / 디버깅)
2. 트래킹 도구? (GA4 / Amplitude / Mixpanel / 자체 구축)
3. 이벤트 범위? (페이지뷰 / 주요 클릭 / 전체 인터랙션)
4. 기존 이벤트 체계 있음?

## 실행 흐름

1. 이벤트 택소노미 설계 (이벤트명, 프로퍼티, 타입)
2. 트래킹 유틸 함수 구현
3. 컴포넌트에 트래킹 코드 삽입
4. 이벤트 발화 검증 → `@qa-checker` 연계

## 트래킹 유틸 패턴 (React 19 + TypeScript)

```typescript
// src/shared/utils/tracking.ts
interface TrackEventOptions {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

export function trackEvent({ event, properties }: TrackEventOptions): void {
  // GA4 / Amplitude / 내부 로거 연동
  console.log('[TRACK]', { event, timestamp: Date.now(), ...properties });
}
```

## 이벤트 택소노미 형식

```markdown
## 이벤트: {event_name}

- 트리거: {어떤 상황에서 발화}
- 프로퍼티:
  | Key | Type | 설명 |
  |-----|------|------|
  | page | string | 현재 페이지 경로 |
  | action | string | 사용자 행동 |
```

---

## 비즈센터 채용 도메인 트래킹 요구사항

### 채용담당자 행동 이벤트

#### 홈 화면 (비즈센터 홈)

```typescript
// 홈 화면 진입
trackEvent({ event: 'bizcenter_home_view', properties: { role: 'master' | 'general' | 'simple' } });

// 회사 정보 더보기 클릭
trackEvent({ event: 'company_info_more_click', properties: { company_id: string } });

// 기업인증 클릭 (미인증 케이스)
trackEvent({ event: 'cert_banner_click', properties: { cert_status: 'unverified' | 'pending' | 'failed' } });

// 비즈머니 충전하기 클릭
trackEvent({ event: 'bizmoney_charge_click', properties: { current_balance: number } });

// 공고 현황 공고 클릭
trackEvent({ event: 'job_posting_click', properties: { job_id: string, status: 'active' | 'waiting' | 'closed' } });

// 채용 진행중 지원자 탭 전환
trackEvent({ event: 'applicant_tab_switch', properties: { tab: 'unread' | 'interview_adjust' | 'interview_done' | 'unreviewed' } });

// 지원자 카드 클릭 (이력서 뷰 이동)
trackEvent({ event: 'applicant_card_click', properties: { applicant_id: string, tab: string, apply_status: string } });

// 면접 캘린더 이동
trackEvent({ event: 'interview_calendar_click', properties: { today_count: number } });
```

#### 채용공고 관련

```typescript
// 공고 등록 시작
trackEvent({ event: 'job_post_start', properties: { source: 'home' | 'list' | 'header' } });

// 공고 등록 완료
trackEvent({ event: 'job_post_complete', properties: { job_id: string, product_type: string } });

// 공고 마감
trackEvent({ event: 'job_post_close', properties: { job_id: string, applicant_count: number } });

// 상품 추천 클릭
trackEvent({ event: 'product_recommend_click', properties: { job_id: string } });
```

#### 지원자 관리 (ATS)

```typescript
// 지원자 심사 상태 변경
trackEvent({
  event: 'applicant_status_change',
  properties: {
    applicant_id: string,
    from_status: string,  // 'unread' | 'reviewing' | 'interview_proposed' | 'interview_accepted' | 'passed' | 'failed'
    to_status: string,
    job_id: string,
  }
});

// 면접 제안
trackEvent({ event: 'interview_propose', properties: { applicant_id: string, job_id: string } });

// 이력서 열람 (과금 이벤트 — 별도 주의)
trackEvent({ event: 'resume_view', properties: { applicant_id: string, job_id: string, is_paid: boolean } });

// 지원자 스크랩
trackEvent({ event: 'applicant_scrap', properties: { applicant_id: string, action: 'add' | 'remove' } });
```

#### 권한 관리

```typescript
// 멤버 초대
trackEvent({ event: 'member_invite', properties: { invite_count: number } });

// 초대 승인/거절
trackEvent({ event: 'member_invite_action', properties: { action: 'approve' | 'reject' } });
```

### 핵심 비즈니스 지표 이벤트

```typescript
// 비즈머니 사용
trackEvent({ event: 'bizmoney_use', properties: { amount: number, service_type: string } });

// 채용 결과 보고서 다운로드
trackEvent({ event: 'report_download', properties: { report_id: string, report_name: string } });

// FAQ/공지사항 클릭
trackEvent({ event: 'support_content_click', properties: { content_type: 'faq' | 'notice', content_id: string } });

// 고객센터 연락
trackEvent({ event: 'cs_contact', properties: { contact_type: 'phone' | 'email', has_rm: boolean } });
```

### 도메인 용어 (트래킹 프로퍼티 작성 시 참조)

| 용어 | 설명 |
|------|------|
| `role` | 채용담당자 권한 — `master` / `general` / `simple` |
| `cert_status` | 기업인증 상태 — `unverified` / `pending` / `success` / `failed` |
| `apply_status` | 지원자 상태 — `unread` / `reviewing` / `interview_proposed` / `interview_accepted` / `passed` / `failed` |
| `product_type` | 채용 상품 유형 — `premium` / `standard` / `free` |
| `bizmoney` | 유료 포인트 |
| `free_point` | 무료 포인트 |
| `rm` | Relationship Manager (채용 컨설턴트) |
| `ats_tab` | ATS 탭 — `unread` / `interview_adjust` / `interview_done` / `unreviewed` |

## 연계

- `@qa-checker` → 트래킹 이벤트 발화 검증
