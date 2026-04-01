# Figma to Component 작업 리포트

작업 완료 시 아래 형식으로 리포트를 생성합니다.

## 리포트 템플릿

```markdown
## 작업 완료 리포트

### 📋 작업 개요

- **Figma URL**: [Figma 디자인 링크]
- **작업 일시**: YYYY-MM-DD HH:mm
- **총 작업 시간**: [X]분

### ✅ 생성/수정된 컴포넌트

#### 신규 생성 (N개)

- `src/components/ComponentName1/index.tsx` - [컴포넌트 설명]
- `src/components/ComponentName2/index.tsx` - [컴포넌트 설명]
- ...

#### 재사용된 로컬 컴포넌트 (N개)

- `BZWRegistControl` (src/shared/ui/BZWRegistControl)
- `BZWIcon` (src/shared/ui/BZWIcon)
- ...

#### 사용된 @jds/theme 컴포넌트 (N개)

- `Button`, `Checkbox`, `TextField`, `SelectBox`
- ...

### 🎨 토큰 매핑 결과

#### 색상 매핑

- `jk/button/primary` (#003cff) → `bg-jk-button-primary` (토큰 이름 매칭)
- `#0057ff` → `bg-blue-700` (정확한 값 매칭)
- `#0058ff` → `bg-[#0058ff]` (arbitrary value)

#### Spacing 매핑

- `16px` → `gap-16`, `p-16` (정확 매칭)
- `17px` → `gap-[17px]` (arbitrary value)

#### Width/Height 매핑

- `1px` → `w-px`, `h-px` (구분선)
- `368px` → `w-[368px]` (고정 크기)
- `100%` → `w-full`, `h-full` (전체 크기)

### 🔧 수정 사항

#### 레이아웃 수정

- [수정 내용 설명]

#### 스타일 수정

- [수정 내용 설명]

#### 아이콘 매핑

- `IconCamera` → `BZWIcon name='system_camera'` (icon-mapper: exact match)
- `IconPhoto` → `BZWIcon name='system_camera'` (icon-mapper: similar match)
- `IconUnknown` → `BZWIcon name='system_exclamationmark'` (icon-mapper: fallback)

### ✅ 검증 결과

#### Prettier/Lint

- ✅ Prettier check 통과: [N]개 파일
- ✅ ESLint check 통과: [N]개 파일

#### Figma 재검증

- ✅ 레이아웃 동일 확인
- ✅ 색상/간격/텍스트 완전 동일 확인
- ✅ Width/Height 1px 포함 모든 값 정확 확인
- ✅ 아이콘 매핑 완료

### 📁 파일 구조
```

src/components/
├── NewComponent1/
│ └── index.tsx (신규 생성)
├── NewComponent2/
│ └── index.tsx (신규 생성)
└── ExistingComponent/
└── index.tsx (✅ 재사용됨)

```

### 🚨 이슈 및 해결

#### 발견된 이슈
1. [이슈 설명]
   - 해결: [해결 방법]
2. [이슈 설명]
   - 해결: [해결 방법]

### 📝 참고 사항

- [추가 참고 사항]
```

## 리포트 예시

```markdown
## 작업 완료 리포트

### 📋 작업 개요

- **Figma URL**: https://figma.com/design/abc123/MyApp?node-id=1-2
- **작업 일시**: 2024-01-15 14:30
- **총 작업 시간**: 25분

### ✅ 생성/수정된 컴포넌트

#### 신규 생성 (2개)

- `src/components/ContactInfo/index.tsx` - 연락처 정보 표시 컴포넌트
- `src/components/BZWLabel/index.tsx` - 라벨 컴포넌트 (primary/secondary 변형)

#### 재사용된 로컬 컴포넌트 (1개)

- `BZWRegistControl` (src/components/BZWRegistControl)

#### 사용된 @jds/theme 컴포넌트 (1개)

- `Checkbox`

### 🎨 토큰 매핑 결과

#### 색상 매핑

- `#e3f1ff` → `bg-[#e3f1ff]` (arbitrary value - tailwind.config에 없음)
- `blue-600` → `text-blue-600` (정확 매칭)

#### Spacing 매핑

- `12px` → `gap-12` (정확 매칭)
- `8px` → `gap-8`, `px-8`, `py-4` (정확 매칭)

### 🔧 수정 사항

#### 아이콘 매핑

- 아이콘 없음

### ✅ 검증 결과

#### Prettier/Lint

- ✅ Prettier check 통과: 2개 파일
- ✅ ESLint check 통과: 2개 파일

#### Figma 재검증

- ✅ 레이아웃 동일 확인
- ✅ 색상/간격/텍스트 완전 동일 확인

### 📁 파일 구조
```

src/components/
├── ContactInfo/
│ └── index.tsx (신규 생성)
├── BZWLabel/
│ └── index.tsx (신규 생성)
└── BZWRegistControl/
└── index.tsx (✅ 재사용됨)

```

### 🚨 이슈 및 해결

- 이슈 없음

### 📝 참고 사항

- `#e3f1ff` 색상은 tailwind.config.mjs에 추가를 권장합니다.
```

## 리포트 작성 가이드

### 작업 개요

- **Figma URL**: 작업한 Figma 디자인 링크를 정확히 기록
- **작업 일시**: 실제 작업을 완료한 시간
- **총 작업 시간**: 전체 작업에 소요된 시간 (분 단위)

### 생성/수정된 컴포넌트

- **신규 생성**: 이번 작업에서 새로 만든 컴포넌트
- **재사용된 로컬 컴포넌트**: 기존 로컬 컴포넌트 중 재사용한 것
- **사용된 @jds/theme 컴포넌트**: JDS 디자인 시스템에서 사용한 컴포넌트

### 토큰 매핑 결과

각 매핑 타입별로 실제 변환 결과를 기록:

- **토큰 이름 매칭**: Figma 토큰 → Tailwind 클래스 (가장 선호)
- **정확한 값 매칭**: 색상 값 → tailwind.config.mjs 클래스
- **Arbitrary value**: config에 없는 값 → `[정확한 값]` 형식

### 검증 결과

- **Prettier/Lint**: 변경된 파일 개수와 통과 여부
- **Figma 재검증**: 레이아웃/색상/간격/텍스트/아이콘 모두 확인

### 이슈 및 해결

발견된 문제와 해결 방법을 기록하여 향후 참고 자료로 활용

### 참고 사항

추가로 주의할 점이나 권장 사항 기록
