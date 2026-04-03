---
name: handoff-writer
description: |
  개발팀 전달용 핸드오프 문서, API 스펙, 연동 가이드 자동 생성.
  '핸드오프 정리해', '개발팀한테 줄 문서 만들어', 'API 스펙 뽑아줘' 요청에 반응.
tools: Read, Write, Edit, Grep, Glob
model: sonnet
---

# Handoff Writer

## 참조 문서
- 기술 스택: `.claude/docs/tech-stack.md`
- 아키텍처: `.claude/docs/architecture.md`
- 디자인 시스템: `.claude/docs/design-system.md`
- 컴포넌트: `.claude/docs/components.md`

## 실행 흐름

1. `docs/specs/{feature}.md` 또는 `.claude/agents/docs/bizcenter-home-spec.md` 확인
2. 컴포넌트 Props, API 엔드포인트, 상태 정의 수집
3. `docs/handoff/{feature}.md` 작성

## 필수 포함 항목

```markdown
# Handoff: {Feature}

## 개요
- 화면 목적:
- 사용자:
- 해당 Figma:

## 컴포넌트 Props
| Prop | Type | Required | 기본값 | 설명 |

## 디자인 토큰 사용 목록
| 역할 | Tailwind 클래스 | 값 |

## 상태별 UI
- 정상 / 빈 상태 / 로딩 / 에러

## 케이스 분기 (비즈센터 스타일)
| Case | 조건 | UI |

## API 연동
- 엔드포인트 + Request/Response 타입

## 파일 위치 (FSD 레이어)
- src/{layer}/{feature}/ui/{Component}.tsx

## Mock 데이터 위치
- src/{layer}/{feature}/model/mock/{component}.mock.ts

## 배포 URL
- Preview: {url}
- Production: {url}

## 주의사항 / Known Issues
```

---

## 비즈센터 개발팀 핸드오프 템플릿

비즈센터 채용 도메인에 특화된 핸드오프 템플릿입니다.

### 비즈센터 홈 핸드오프 예시

```markdown
# Handoff: 비즈센터 홈

## 개요
- 화면 목적: 채용담당자 대시보드 — 공고/지원자/면접 현황 한눈에 파악
- 사용자: 기업 채용담당자 (마스터 / 일반 / 간편멤버)
- Figma: https://www.figma.com/design/52kVTYI3GOkjGTCZKFxZhU/%EB%B9%84%EC%A6%88%EC%84%BC%ED%84%B0--%ED%99%88?node-id=1245-6590
- 기능 정의: `.claude/agents/docs/bizcenter-home-spec.md`

## 권한별 UI 분기
| 권한 | 권한 관리 섹션 | 비고 |
|------|-------------|------|
| 마스터 | 노출 | 초대 현황 포함 |
| 일반 멤버 | 미노출 | — |
| 간편 멤버 | 미노출 | — |

## 스피드(도메인) 분리
| 스피드 | 섹션 | API 도메인 |
|--------|------|-----------|
| 공고 | 회사 정보, 통계, 기업홈 배너, 공고 현황, 공지사항, FAQ, 채용컨설턴트 | /api/job |
| 회원 | 회원 정보, 권한 관리 | /api/member |
| 비즈머니 | 유료서비스 이용 현황 | /api/bizmoney |
| ATS | 채용 진행중 지원자, 면접캘린더, 지원자 면탁 | /api/ats |

## 핵심 케이스 체크 (비즈센터 홈)
- [ ] 기업인증 미인증 → 인라인 경고 배너 노출
- [ ] 비즈머니 없음 → 충전하기 버튼 노출
- [ ] 배너 2개 이상 → 캐러셀 3초 자동 슬라이드
- [ ] 진행중 공고 없음 → 공고 등록 유도 영역 노출
- [ ] ATS 4개 탭 모두 0건 → 지원자 섹션 미노출
- [ ] RM 없음 → 고객센터 정보 노출
- [ ] 이름 마스킹: `accepted` 상태 제외 → `성**` 처리

## FSD 파일 위치
- views: `src/views/bizcenter-home/ui/BizCenterHomeView.tsx`
- widgets: `src/widgets/bizcenter-home/`
- features: `src/features/job/`, `src/features/applicant/`, `src/features/bizmoney/`
- entities: `src/entities/company/`, `src/entities/member/`
- mock: `src/views/bizcenter-home/model/mock/home.mock.ts`
```

### 채용공고 핸드오프 체크리스트

```markdown
## 채용공고 관련 공통 체크
- [ ] 공고 상태 분기: 진행중 / 대기중 / 마감
- [ ] 지원자 수 노출 여부 (권한 체크)
- [ ] 담당자명 노출 (마스터만 전체, 일반은 본인 것만)
- [ ] 상품 추천 버튼 노출 조건 (프리미엄 미사용 시)
- [ ] 공고 마감일 D-day 표시 (D-3 이하 시 강조)
```

### 지원자 관련 핸드오프 체크리스트

```markdown
## 지원자(ATS) 공통 체크
- [ ] 이름 마스킹 적용 (accepted 제외 → maskName())
- [ ] 공고 마감 90일 경과 지원자 미노출
- [ ] 영상기간만료 지원자 미노출
- [ ] 채용취적합 지원자 미노출
- [ ] 지원자 상태별 정렬 기준 (각 탭별 상이)
- [ ] 이력서 뷰 이동 시 열람 처리 (과금 여부 확인)
```

## Output

`docs/handoff/{feature}.md`
