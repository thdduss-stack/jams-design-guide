# 시각적 디자인 원칙

> Figma 없이 UI를 생성할 때 Claude가 따르는 시각적 판단 기준.
> 토큰/컨벤션과 함께 반드시 참조.

---

## 1. 정보 위계 원칙

### 한 화면에 주인공은 하나
- 가장 중요한 정보 1개를 시각적으로 압도적으로 크게
- 나머지는 보조 → 3단계 이상 위계 구분 (Primary / Secondary / Tertiary)

```
Primary   → text-18~20 font-semibold text-gray-950
Secondary → text-14~16 font-medium text-gray-700
Tertiary  → text-12~13 font-regular text-gray-500
```

### 시선 흐름: 좌상→우하
- 로고/브랜드 → 제목 → 핵심 정보 → 부가 정보 → CTA 순서
- CTA(지원하기, 제안하기 등)는 항상 시선 마지막 위치 또는 고정 하단

---

## 2. 카드 구성 원칙

### 공고 카드 (CommJAMS JK 모바일)
```
[로고 44~48px]          [스크랩 아이콘]
회사명 (text-12 gray-500)
공고 제목 (text-14~15 font-semibold gray-950) ← 2줄 말줄임
지역 · 고용형태 (text-12 gray-500)
급여 (text-12 font-semibold gray-700)
[태그] [태그]            ← h-20, text-11 font-semibold
────────────────────────
추천이유 (text-11 blue-500)    D-day (text-11 red/#f37676)
```

**규칙:**
- 카드 내부 padding: `p-16`
- 카드 radius: `rounded-12` (CommJAMS JK)
- 카드 shadow: `0px 4px 16px rgba(0,0,0,0.07)`
- 카드 border: `border border-gray-100`
- 회사 로고는 항상 좌상단 첫 시선

### BizJAMS 관리자 카드
```
섹션 제목 (text-16 font-semibold)
────────────────────────
내용
────────────────────────
액션 버튼 (우하단 정렬)
```
- 카드 radius: `rounded-8` (BizJAMS)
- 카드 border: `border border-bluegray-100`
- 내부 padding: `p-20~24`

---

## 3. 여백 & 밀도 원칙

### 모바일 (CommJAMS JK)
- 화면 좌우 여백: `px-16`
- 섹션 간격: `mb-16~24`
- 카드 간 gap: `gap-10~12`
- 컴포넌트 내부 요소 간격: `gap-4~8`

### 데스크탑 (BizJAMS)
- 화면 좌우 여백: `px-40`
- 섹션 간격: `mb-24~32`
- 카드 간 gap: `gap-16~24`
- 테이블 행 높이: `h-56`

### 밀도 선택 기준
| 화면 목적 | 밀도 | 이유 |
|---------|------|------|
| 탐색 (목록, 검색) | 높음 | 많은 항목 스캔 |
| 상세 (공고뷰, 프로필) | 낮음 | 집중 읽기 |
| 대시보드 | 중간 | 지표 파악 |
| 온보딩 | 매우 낮음 | 부담 없이 |

---

## 4. 색상 사용 원칙

### 색상은 의미를 전달할 때만
- Blue → 주요 액션, 브랜드, 링크
- Red(`#f37676`) → 마감 임박, 경고
- Green → 완료, 성공, 합격
- Gray → 비활성, 보조 정보
- **장식용 색상 사용 금지** (배경 전체를 색으로 채우는 것 지양)

### 텍스트 색상 계층
```
gray-950 → 핵심 정보 (공고명, 회사명 강조)
gray-700 → 중요 정보 (급여, 직급)
gray-500 → 보조 정보 (지역, 날짜)
gray-400 → 힌트, 플레이스홀더
gray-300 → disabled, 구분선 텍스트
```

### 배경 계층
```
base-white  → 카드, 콘텐츠 영역
gray-50     → 페이지 배경, 섹션 구분
gray-100    → 인풋 배경, 태그 배경
```

---

## 5. 버튼 & CTA 원칙

### CTA 배치
- 모바일: 주요 CTA는 풀너비(`w-full`) 또는 화면 하단 고정
- 데스크탑: 우측 정렬, primary 버튼은 오른쪽 끝
- 버튼 2개 나란히 → outlined 먼저, contained 나중 (취소|확인)

### 버튼 크기 선택
```
h-52 → 온보딩, 랜딩 메인 CTA (거의 안 씀)
h-48 → 모바일 풀너비 CTA (지원하기)
h-40 → 일반 액션 버튼 ← BizJAMS 기본
h-32 → 필터 칩, 인라인 액션
```

---

## 6. 태그 & 뱃지 원칙

### 태그
```tsx
// 공고 태그 (CommJAMS)
<span className="inline-flex items-center h-20 px-6 rounded-4 bg-gray-50 border border-gray-100 text-11 font-semibold text-gray-500">
  재택가능
</span>

// 상태 뱃지 (색상 있음)
<span className="inline-flex items-center h-20 px-6 rounded-4 bg-blue-50 border border-blue-100 text-11 font-semibold text-blue-500">
  정규직
</span>
```

### 태그 최대 2~3개
- 카드 내 태그는 최대 2개 노출 (공간 부족 시 1개)
- 넘치면 잘라내고 `+N` 방식 사용하지 않음

---

## 7. 빈 상태 & 로딩 원칙

### 빈 상태
- 아이콘(special_empty, 48px) + 제목(text-16 font-semibold) + 설명(text-14 gray-500)
- CTA가 있으면 outlined 버튼 하나
- 중앙 정렬, 상하 패딩 `py-80`

### 스켈레톤 로딩
- 실제 컴포넌트와 같은 크기/형태 유지
- 색상: `bg-gray-100` animate-pulse
- 텍스트 줄은 rounded-4 사각형으로 표현

---

## 8. 시각적 판단이 필요한 경우 → 먼저 물어보기

아래 상황에서는 임의로 결정하지 않고 사용자에게 먼저 확인:

- 레이아웃 형태가 2가지 이상 가능할 때 (가로 스크롤 vs 그리드)
- 강조 방식이 불명확할 때 (색상 강조 vs 크기 강조)
- 정보 우선순위가 PRD에 명시되지 않았을 때
- 빈 상태 / 에러 상태 디자인이 필요할 때

```
"레이아웃을 [A안] 또는 [B안]으로 잡을 수 있어요. 어떤 방향이 좋아요?"
```

---

## 9. CommJAMS JK 모바일 레이아웃 패턴

### 가로 스크롤 카드 (추천, 관련 공고)
- 카드 너비: `w-[196px]` 고정
- 패딩: `px-16`, 마지막 카드 우측 여백 확보
- 스크롤바 숨김: `style={{ scrollbarWidth: 'none' }}`
- 사용: 추천 공고, 최근 본 공고, 기업 추천

### 2열 그리드 (탐색, 검색 결과)
- `grid grid-cols-2 gap-10 px-16`
- 카드 내부 정보 압축 (태그 최대 2개)
- 사용: JOB찾기, 카테고리 탐색

### 리스트 (유사 공고, 상세 연관)
- `divide-y divide-gray-100`
- 행 높이: 자동 (padding `py-16`)
- 로고 44px, 정보 flex-1
- 사용: 공고뷰 하단, ATS 지원자 목록

### 섹션 구분
- 섹션 간 `h-8 bg-gray-50` 구분선 (진한 구분이 필요할 때)
- 또는 `border-t border-gray-100` (가벼운 구분)
- 배경색 변경으로 섹션 구분 금지 (gray-50 배경 위에 white 카드 패턴 고수)
