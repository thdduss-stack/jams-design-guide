# 실행 순서 상세 가이드

Figma URL을 받았을 때의 전체 실행 순서와 각 단계별 상세 설명입니다.

## 실행 순서 개요

```
0. URL 파싱 및 기본 검증
        ↓
1. 📊 Figma 데이터 수집 (MCP 호출)
        ↓
2. 🏗️ DDP 아키텍처 확인 (필수)
        ↓ 사용자 승인
3. 서브 에이전트 호출 (선택)
        ↓
4. 컴포넌트 생성/수정
        ↓
5. 진단 이슈 해결
        ↓
6. Prettier/Lint 검증
        ↓
7. 최종 검증 (Figma 재검증)
        ↓
8. 완료 선언
```

---

## 단계별 상세 설명

### 0단계: URL 파싱 및 기본 검증

**목적:** Figma URL에서 필요한 정보 추출 및 유효성 검증

**수행 작업:**

```typescript
// URL 파싱
const url = 'https://figma.com/design/abc123/MyDesign?node-id=100-200';
const { fileKey, nodeId } = parseFigmaUrl(url);
// fileKey: "abc123"
// nodeId: "100:200" (하이픈을 콜론으로 변환)
```

**검증 항목:**

- [ ] URL 형식이 올바른가?
- [ ] fileKey가 존재하는가?
- [ ] nodeId가 존재하는가?

**오류 처리:**

- URL 형식 오류 → 사용자에게 올바른 형식 안내
- 파라미터 누락 → 필요한 정보 요청

---

### 1단계: Figma 데이터 수집 (MCP 호출)

**목적:** Figma 디자인 정보와 디자인 토큰 수집

**수행 작업:**

```typescript
// 병렬 데이터 수집
const [designContext, variableDefs] = await Promise.all([
  mcp_Figma_get_design_context({ fileKey, nodeId }),
  mcp_Figma_get_variable_defs({ fileKey, nodeId }),
]);
```

**수집 데이터:**

- `designContext`: 노드 구조, 스타일, 레이아웃 정보
- `variableDefs`: 디자인 토큰 (색상, spacing 등)

**Tailwind Config 확인:**

```bash
# 필요한 섹션만 grep으로 확인 (전체 read 지양)
grep -E "colors|spacing|fontSize|borderRadius|boxShadow" tailwind.config.mjs
```

---

### 2단계: DDP 아키텍처 확인 (필수) 🔴

**목적:** 컴포넌트 배치 위치 결정 및 사용자 승인

**⚠️ 이 단계는 필수이며, 사용자 승인 없이 파일 생성을 진행하지 않습니다.**

**수행 작업:**

1. **컴포넌트 분석:**
   - Figma 노드에서 컴포넌트 후보 추출
   - 각 컴포넌트의 성격 파악

2. **유형 결정:** (참조: [component-type-decision.md](component-type-decision.md))
   - 공용 UI / 엔티티 UI / 기능 UI / 뷰 / 위젯

3. **폴더 구조 확인 요청:**

```markdown
## 📁 폴더 구조 확인

Figma 디자인 분석 결과, 다음 구조로 컴포넌트를 생성하려고 합니다:

### 생성 예정 파일

| 파일 경로                                         | 컴포넌트명  | 유형      |
| ------------------------------------------------- | ----------- | --------- |
| `src/entities/applicants/ui/ResumeCard/index.tsx` | ResumeCard  | 엔티티 UI |
| `src/shared/ui/StatusBadge/index.tsx`             | StatusBadge | 공용 UI   |

**어떻게 진행할까요?**

1. ✅ 이 구조로 진행
2. 📝 경로 수정 요청
3. ⏸️ 잠시 대기
```

4. **사용자 승인 대기:**
   - 승인 → 다음 단계 진행
   - 수정 요청 → 경로 수정 후 재확인
   - 대기 → 중단

**DDP 레이어 연동 확인 (Feature UI의 경우):**

```typescript
// Feature UI 생성 시 확인
const ddpFiles = [
  'src/features/{feature}/domain/entities.ts',
  'src/features/{feature}/domain/repository.ts',
  'src/features/{feature}/data/mapper.ts',
  'src/features/{feature}/model/hooks/',
];

// 존재하지 않는 레이어가 있으면 안내
if (!existsDomainLayer) {
  console.log('⚠️ 이 Feature에는 domain 레이어가 없습니다.');
  console.log('UI만 생성할까요? 아니면 DDP 전체 구조를 먼저 생성할까요?');
}
```

---

### 3단계: 서브 에이전트 호출 (선택)

**목적:** 복잡한 화면의 상세 분석/매핑

**호출 조건:**

- ✅ 5개 이상 컴포넌트
- ✅ 폼 요소가 많음
- ✅ 재사용 후보가 많음
- ✅ 매핑 정확도가 중요

**생략 조건:**

- ⏭️ 단순한 화면 (단일 컴포넌트)
- ⏭️ 빠른 프로토타입

**서브 에이전트:**

- `figma-react-ui`: 분석/매핑 리포트 생성
- `repo-component-indexer`: 로컬 컴포넌트 매칭
- `icon-mapper`: 아이콘 매핑

---

### 4단계: 컴포넌트 생성/수정

**목적:** 실제 파일 생성 및 코드 작성

**수행 작업:**

1. 컴포넌트 파일 생성 (`index.tsx`)
2. Props 인터페이스 정의
3. Tailwind CSS 클래스 적용
4. 로컬/JDS 컴포넌트 재사용

**재사용 우선순위:**

```
1. CodeConnectSnippet (있으면 최우선)
2. Indexer 매칭 결과 (로컬 컴포넌트)
3. @jds/theme 컴포넌트
4. 신규 생성
```

---

### 5단계: 진단 이슈 해결

**목적:** TypeScript, ESLint 오류 수정

**수행 작업:**

```bash
# TypeScript 체크
pnpm tsc --noEmit

# ESLint 체크
pnpm lint:check -- --file <생성된 파일>
```

**오류 유형별 처리:**

- 타입 오류 → 타입 수정
- import 오류 → 경로 수정
- lint 오류 → 코드 수정

---

### 6단계: Prettier/Lint 검증 (필수)

**목적:** 코드 스타일 일관성 확보

**수행 작업:**

```bash
# Prettier 검증
pnpm prettier --check <변경 파일>

# 실패 시 자동 수정
pnpm prettier --write <변경 파일>

# ESLint 검증
pnpm lint:check -- --file <변경 파일>

# 실패 시 자동 수정
pnpm lint
```

---

### 7단계: 최종 검증 (Figma 재검증)

**목적:** 생성된 컴포넌트가 Figma 디자인과 일치하는지 확인

**검증 기준:**

1. **레이아웃**: 정렬, 배치, 그룹 구조, 폭/높이
2. **컬러**: 토큰/값 정확히 일치
3. **간격**: padding/margin/gap 정확히 일치
4. **텍스트**: fontSize/weight/lineHeight/color
5. **폼 요소**: 상태/스타일/크기/라벨 배치
6. **아이콘**: icon-mapper로 매핑 확인

**불일치 발견 시:**

- 수정 작업 추가 → 수정 → 7단계 반복

---

### 8단계: 완료 선언

**조건:** 7단계 검증 통과

**출력 형식:**

```markdown
## ✅ 완료

### 생성된 파일

- `src/entities/applicants/ui/ResumeCard/index.tsx`
- `src/shared/ui/StatusBadge/index.tsx`

### 사용된 컴포넌트

- 로컬: BZWIcon, BZWIDAvatar
- @jds/theme: Button, Separator

### 적용된 토큰

- 색상: gray-900, blue-700
- 간격: gap-16, p-24
```

---

## 확인 없이 진행 가능한 경우

다음 조건을 **모두** 만족할 때만 2단계(DDP 확인) 생략 가능:

1. 기존 컴포넌트 **수정**만 하는 경우 (신규 생성 없음)
2. 동일 폴더 내 파일 추가 (기존 구조 유지)
3. `src/shared/ui/` 내 단순 유틸리티 컴포넌트

---

## 오류 발생 시 처리

| 단계 | 오류 유형      | 처리 방법                    |
| ---- | -------------- | ---------------------------- |
| 0    | URL 파싱 실패  | 올바른 형식 안내             |
| 1    | Figma MCP 오류 | 권한/네트워크 확인 요청      |
| 2    | 사용자 거부    | 작업 중단                    |
| 4    | 파일 생성 실패 | 권한 확인, 경로 재검토       |
| 5    | 타입 오류      | 수동 수정 후 재시도          |
| 6    | Lint 오류      | 자동 수정 시도, 실패 시 수동 |
| 7    | 디자인 불일치  | 수정 작업 추가 후 재검증     |
