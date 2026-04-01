# 디자인 검수 리포트 템플릿

이 템플릿을 사용하여 Figma 디자인과 실제 구현 간의 차이점을 문서화합니다.

---

# 디자인 검수 리포트

## 검수 정보

| 항목          | 내용                          |
| ------------- | ----------------------------- |
| **Figma URL** | `[Figma 링크]`                |
| **구현 경로** | `[로컬 페이지/컴포넌트 경로]` |
| **검수 일시** | `YYYY-MM-DD HH:mm`            |
| **검수 범위** | 페이지 전체 / 섹션 / 컴포넌트 |
| **검수자**    | Claude Code                   |

---

## 검수 결과 요약

| 항목     | 통과 | 이슈 | 총계 |
| -------- | ---- | ---- | ---- |
| 색상     | ✅ 0 | ❌ 0 | 0    |
| 간격     | ✅ 0 | ❌ 0 | 0    |
| 폰트     | ✅ 0 | ❌ 0 | 0    |
| 레이아웃 | ✅ 0 | ❌ 0 | 0    |
| 아이콘   | ✅ 0 | ❌ 0 | 0    |
| **총계** | ✅ 0 | ❌ 0 | 0    |

### 전체 평가

- **일치율**: 0%
- **심각도**: 🟢 통과 / 🟡 경미한 수정 필요 / 🔴 주요 수정 필요

---

## 시각적 차이 (1차 검수)

### 스크린샷 비교

| Figma                                     | 구현                                      |
| ----------------------------------------- | ----------------------------------------- |
| ![Figma Screenshot](figma-screenshot.png) | ![Local Screenshot](local-screenshot.png) |

### 발견된 차이점

| #   | 영역 | 차이 설명          | 심각도  |
| --- | ---- | ------------------ | ------- |
| 1   | 헤더 | 배경색이 더 어두움 | 🔴 높음 |
| 2   | 버튼 | 패딩이 작음        | 🟡 중간 |
| 3   | 카드 | 그림자가 약함      | 🟢 낮음 |

---

## 토큰 레벨 분석 (2차 검수)

### 색상

| 요소      | Figma 색상 | Figma 토큰          | 코드 클래스            | 실제 값   | 상태 | 수정 사항     |
| --------- | ---------- | ------------------- | ---------------------- | --------- | ---- | ------------- |
| 헤더 배경 | `#0057ff`  | `blue-700`          | `bg-blue-600`          | `#0055ff` | ❌   | `bg-blue-700` |
| 텍스트    | `#333333`  | `gray-900`          | `text-gray-900`        | `#333333` | ✅   | -             |
| 버튼 배경 | `#003cff`  | `jk-button-primary` | `bg-jk-button-primary` | `#003cff` | ✅   | -             |

### 간격 (Spacing)

| 요소     | 속성      | Figma 값 | 코드 클래스 | 실제 값 | 상태 | 수정 사항 |
| -------- | --------- | -------- | ----------- | ------- | ---- | --------- |
| 버튼     | padding-x | `24px`   | `px-20`     | `20px`  | ❌   | `px-24`   |
| 버튼     | padding-y | `16px`   | `py-14`     | `14px`  | ❌   | `py-16`   |
| 카드     | gap       | `16px`   | `gap-16`    | `16px`  | ✅   | -         |
| 컨테이너 | padding   | `24px`   | `p-24`      | `24px`  | ✅   | -         |

### 폰트 (Typography)

| 요소 | 속성        | Figma 값 | 코드 클래스  | 실제 값 | 상태 | 수정 사항    |
| ---- | ----------- | -------- | ------------ | ------- | ---- | ------------ |
| 제목 | font-size   | `24px`   | `text-24`    | `24px`  | ✅   | -            |
| 제목 | font-weight | `700`    | `font-bold`  | `700`   | ✅   | -            |
| 본문 | font-size   | `16px`   | `text-14`    | `14px`  | ❌   | `text-16`    |
| 본문 | line-height | `24px`   | `leading-20` | `20px`  | ❌   | `leading-24` |

### 레이아웃

| 요소     | 속성           | Figma 값 | 코드 클래스   | 상태 | 수정 사항      |
| -------- | -------------- | -------- | ------------- | ---- | -------------- |
| 컨테이너 | display        | `flex`   | `flex`        | ✅   | -              |
| 컨테이너 | flex-direction | `column` | `flex-col`    | ✅   | -              |
| 컨테이너 | align-items    | `center` | `items-start` | ❌   | `items-center` |
| 리스트   | gap            | `12px`   | `gap-8`       | ❌   | `gap-12`       |

### 아이콘

| 요소      | Figma 아이콘   | 코드 아이콘              | 크기 일치 | 색상 일치              | 상태 | 수정 사항          |
| --------- | -------------- | ------------------------ | --------- | ---------------------- | ---- | ------------------ |
| 검색 버튼 | `ic_24_search` | `<Icon name="search" />` | ✅ 24px   | ❌ gray-600 → gray-500 | ❌   | `color="gray-600"` |
| 닫기 버튼 | `ic_20_close`  | `<Icon name="close" />`  | ✅ 20px   | ✅                     | ✅   | -                  |

---

## 수정 권장사항

### 🔴 높음 (즉시 수정 필요)

- [ ] **`src/features/jobs/ui/Header/index.tsx:15`**
  - 변경: `bg-blue-600` → `bg-blue-700`
  - 이유: 브랜드 색상 불일치

### 🟡 중간 (권장 수정)

- [ ] **`src/features/jobs/ui/Button/index.tsx:23`**
  - 변경: `px-20 py-14` → `px-24 py-16`
  - 이유: 버튼 크기 불일치

- [ ] **`src/features/jobs/ui/Card/index.tsx:8`**
  - 변경: `items-start` → `items-center`
  - 이유: 정렬 불일치

### 🟢 낮음 (선택적 수정)

- [ ] **`src/features/jobs/ui/Card/index.tsx:12`**
  - 변경: `shadow-sm` → `shadow-md`
  - 이유: 미세한 그림자 차이

---

## 수정 코드 예시

### Header.tsx

```diff
- <header className="bg-blue-600 px-24 py-16">
+ <header className="bg-blue-700 px-24 py-16">
```

### Button.tsx

```diff
- <button className="px-20 py-14 bg-jk-button-primary">
+ <button className="px-24 py-16 bg-jk-button-primary">
```

### Card.tsx

```diff
- <div className="flex flex-col items-start gap-8">
+ <div className="flex flex-col items-center gap-12">
```

---

## 검수 완료 체크리스트

- [ ] 모든 🔴 높음 이슈 수정 완료
- [ ] 모든 🟡 중간 이슈 검토 완료
- [ ] 수정 후 재검수 수행
- [ ] 최종 스크린샷 비교 확인

---

## 부록

### A. Tailwind 토큰 매핑 참조

| Figma 값  | Tailwind 클래스       | 비고           |
| --------- | --------------------- | -------------- |
| `#0057ff` | `blue-700`            | 브랜드 블루    |
| `#003cff` | `jk-button-primary`   | 버튼 기본색    |
| `16px`    | `16` (e.g., `gap-16`) | 기본 간격 단위 |
| `24px`    | `24` (e.g., `p-24`)   | 큰 간격 단위   |

### B. 사용된 도구

- Figma MCP: `mcp__figma__get_screenshot`, `mcp__figma__get_design_context`, `mcp__figma__get_variable_defs`
- Playwright MCP: `mcp__playwright__browser_take_screenshot`, `mcp__playwright__browser_navigate`
- 코드 분석: Grep, Read

---

_이 리포트는 Claude Code의 design-review 스킬에 의해 자동 생성되었습니다._
