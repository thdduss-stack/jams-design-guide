---
name: icon-mapper
description: |
  Figma 아이콘을 프로젝트 아이콘으로 매핑하는 서브 에이전트.

  figma-to-component에서 아이콘 노드 처리 시 호출됩니다.
  토큰 절약을 위해 아이콘 처리가 필요할 때만 호출합니다.

trigger: |
  - figma-to-component에서 아이콘 노드 발견 시
  - 아이콘 매핑이 필요한 경우
---

# Icon Mapper 서브 에이전트

Figma 디자인의 아이콘을 프로젝트에서 사용 가능한 아이콘으로 매핑합니다.

## 아이콘 컴포넌트 선택 기준

**BZWIcon 우선 사용 정책**: 프로젝트 커스텀 아이콘을 먼저 검색하고, 없을 때만 @jds/theme Icon 사용

| 우선순위 | 컴포넌트          | Prefix               | 참조 파일                                  |
| -------- | ----------------- | -------------------- | ------------------------------------------ |
| 1        | `BZWIcon`         | `special_*`          | `src/shared/ui/BZWIcon/constants.ts`       |
| 2        | `BZWIcon`         | `system_*`           | `src/shared/ui/BZWSystemIcons/index.tsx`   |
| 3        | `@jds/theme` Icon | `system_*`, `line_*` | `node_modules/@jds/theme/rules/Icon.AI.md` |

## 매핑 프로세스

### 1. Figma 아이콘 이름 정규화

```javascript
// Figma에서 가져온 다양한 아이콘 이름 형태
"IconCamera" → "camera"
"icon-camera" → "camera"
"Camera Icon" → "camera"
"icon/camera" → "camera"
"system_camera" → "camera" (이미 prefix 있는 경우 제거)
```

### 2. 프로젝트 아이콘 검색 (grep 사용)

**검색 순서**: BZWIcon → @jds/theme Icon

```bash
# 1. BZWIcon special_* 검색 (최우선)
grep -i "special_camera" src/shared/ui/BZWIcon/constants.ts

# 2. BZWIcon system_* 검색
grep -i "system_camera" src/shared/ui/BZWSystemIcons/index.tsx

# 3. @jds/theme Icon 검색 (BZWIcon에 없을 때만)
grep -i "system_camera\|line_camera" node_modules/@jds/theme/rules/Icon.AI.md
```

### 3. 매칭 우선순위

1. **정확한 이름 매칭**: `camera` → `system_camera`
2. **유사 이름 매칭**: `photo` → `system_camera` (시각적 유사성)
3. **fallback**: 매칭 실패 시 placeholder 아이콘 사용

## 출력 형식

```typescript
interface IconMapResult {
  figmaName: string; // 원본 Figma 아이콘 이름
  normalizedName: string; // 정규화된 이름
  projectName: string | null; // 매핑된 프로젝트 아이콘 이름
  component: '@jds/theme' | 'BZWIcon';
  import: string; // import 문
  usage: string; // 사용 코드
  confidence: 'exact' | 'similar' | 'fallback';
}
```

## 사용 예시

자세한 사용 예시와 매핑 테이블은 [examples.md](references/examples.md)를 참조하세요.

**포함된 내용:**

- BZWIcon 사용 예시 (special*\*, system*\*)
- @jds/theme Icon 사용 예시
- 아이콘 매칭 시나리오 (정확한 매칭, 유사 매칭, fallback)
- 주요 아이콘 매핑 테이블
- 매핑 실패 처리 방법

## 참조 파일 경로

- **BZWIcon special\_\* 목록**: `src/shared/ui/BZWIcon/constants.ts` (최우선)
- **BZWIcon system\_\* 목록**: `src/shared/ui/BZWSystemIcons/index.tsx`
- **@jds/theme Icon 목록**: `node_modules/@jds/theme/rules/Icon.AI.md` (BZWIcon에 없을 때)

## 참고 자료

- [사용 예시 및 매핑 테이블](references/examples.md)
