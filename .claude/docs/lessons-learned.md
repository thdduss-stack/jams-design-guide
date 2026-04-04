# Lessons Learned

> 대화 중 발견한 규칙, 실수, 개선 사항을 누적 기록.
> Claude가 다음 대화에서 같은 실수를 반복하지 않기 위한 문서.

---

## 2026-04-04

### 문서 구조

- `.claude/agents/docs/` 에 파편화된 문서 12개 → `.claude/docs/` 로 통합. 에이전트가 여러 파일 찾아다니지 않고 단일 파일 참조
- `CLAUDE.md` 는 인덱스 역할만. 내용 자체는 `.claude/docs/` 참조 파일에 위임
- 에이전트 파일(`.claude/agents/*.md`)이 비어있으면 도메인 지식 채워야 함 — 비즈센터 케이스, 버그 패턴, 트래킹 이벤트 등

### 스타일 불일치

- `design-guide.md` 에 데스크탑 최소 너비가 `1216px` 로 잘못 기재 → 실제 스펙 `1038px` 로 수정
- 문서 작성 시 CLAUDE.md 와 각 문서 간 수치 일치 여부 항상 크로스체크

### Git / 배포

- 사내 Git 서버(`git.jobkorea.co.kr:443`) 는 VPN 없이 접근 불가 → 외부 공유는 `github.com/thdduss-stack` 사용
- GitHub 레포 `jams-design-guide` 에 문서 push 후 VitePress + GitHub Pages 로 웹 배포
- GitHub Pages 활성화: Settings → Pages → Source → **GitHub Actions**

### Figma MCP

- View seat (Organization plan) 기준 일일 rate limit 존재 → 24시간 롤링 윈도우로 리셋
- Rate limit 걸리면 Figma 작업 전날 같은 시간대 이후에 재시도

### Notion

- `Claude로 디자인하기` 페이지 → 편집 권한 없음
- 작업 기록 대상: `🐱 BIZ_CENTER_TFT` (ID: `32c7d832-2b04-8029-8537-e63dcfdb50c8`)
- 모든 작업 완료 후 해당 페이지 하위에 추가 페이지로 기록

### 워크플로우

- 레슨런/새 규칙 발견 시 → 이 파일(`lessons-learned.md`)에 날짜별로 추가
- 중요도 높으면 `CLAUDE.md` 핵심 규칙 요약에도 반영
- 작업 후 GitHub push → Notion 기록 순서로 마무리

---

## 템플릿 (다음 레슨런 추가 시)

```
### YYYY-MM-DD

### {카테고리}

- {교훈 요약} → {근거 또는 수정 내용}
```
