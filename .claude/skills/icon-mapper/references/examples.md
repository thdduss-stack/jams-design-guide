# Icon Mapper 사용 예시

## 컴포넌트별 사용 예시

### BZWIcon (special\_\* - 컬러 아이콘)

컬러가 포함된 아이콘으로, 원본 색상을 유지합니다.

```tsx
import BZWIcon from '@shared/ui/BZWIcon';

// 기본 사용 - 원본 색상 유지
<BZWIcon name='special_email' size='24' />

// ⚠️ color prop은 무시됨
<BZWIcon name='special_email' size='24' color='blue700' /> // color 적용 안됨
```

**주요 special\_\* 아이콘:**

- `special_email` - 이메일
- `special_folder` - 폴더
- `special_file_excel` - 엑셀 파일
- `special_file_pdf` - PDF 파일

### BZWIcon (system\_\* - 단색 아이콘)

단색 아이콘으로, color prop으로 색상 변경이 가능합니다.

```tsx
import BZWIcon from '@shared/ui/BZWIcon';

// 기본 사용
<BZWIcon name='system_camera' size='24' />

// 색상 변경 가능
<BZWIcon name='system_camera' size='24' color='blue700' />

// 크기 조절
<BZWIcon name='system_search' size='16' color='gray600' />
```

### @jds/theme Icon

BZWIcon에 원하는 아이콘이 없을 때 사용합니다.

```tsx
import { Icon } from '@jds/theme';

// 기본 사용
<Icon name="system_camera" />

// 크기 및 색상 변경
<Icon name="system_camera" size="24" color="gray700" />

// 접근성 텍스트 추가
<Icon name="system_camera" irName="카메라" />

// line_* prefix 아이콘
<Icon name="line_arrow_right" size="20" color="blue600" />
```

## 아이콘 매칭 시나리오

### 시나리오 1: 정확한 매칭

Figma 아이콘과 프로젝트 아이콘이 정확히 일치하는 경우

```tsx
// Figma: IconCamera
// 1. BZWIcon system_camera 검색 → 발견 ✅
<BZWIcon name='system_camera' size='24' />
```

### 시나리오 2: 유사 아이콘 사용

정확한 매칭은 없지만 유사한 아이콘이 있는 경우

```tsx
// Figma: IconPhoto
// 1. BZWIcon special_photo 검색 → 없음
// 2. BZWIcon system_photo 검색 → 없음
// 3. @jds/theme system_photo 검색 → 없음
// 4. 유사 아이콘: system_camera 선택 ✅

<BZWIcon name='system_camera' /> {/* Figma: IconPhoto - 유사 아이콘 사용 */}
```

### 시나리오 3: Fallback 아이콘

매칭되는 아이콘이 전혀 없는 경우

```tsx
// Figma: IconCustomUnknown
// 1. BZWIcon 검색 → 없음
// 2. @jds/theme 검색 → 없음
// 3. Placeholder 아이콘 사용 ✅

<BZWIcon name="system_exclamationmark" /> {/* Figma: IconCustomUnknown - 매칭 실패 */}
```

## 주요 아이콘 매핑 테이블

### 자주 사용되는 아이콘

| Figma 이름              | 프로젝트 아이콘       | 컴포넌트   |
| ----------------------- | --------------------- | ---------- |
| camera, photo           | `system_camera`       | BZWIcon    |
| search                  | `system_search`       | BZWIcon    |
| close, x                | `system_close`        | BZWIcon    |
| check                   | `system_check`        | BZWIcon    |
| arrow_left              | `system_arrow_left`   | BZWIcon    |
| arrow_right             | `system_arrow_right`  | BZWIcon    |
| arrow_up                | `system_arrow_up`     | BZWIcon    |
| arrow_down              | `system_arrow_down`   | BZWIcon    |
| calendar                | `system_calendar`     | BZWIcon    |
| edit, modify            | `system_modify`       | BZWIcon    |
| delete, trash           | `system_delete`       | BZWIcon    |
| plus, add               | `system_plus`         | BZWIcon    |
| minus                   | `system_minus_circle` | BZWIcon    |
| email, mail             | `special_email`       | BZWIcon    |
| folder                  | `special_folder`      | BZWIcon    |
| file_excel              | `special_file_excel`  | BZWIcon    |
| file_pdf                | `special_file_pdf`    | BZWIcon    |
| chevron_left (JDS only) | `system_chevron_left` | @jds/theme |
| info (JDS only)         | `line_info`           | @jds/theme |

### 컬러 아이콘 (special\_\*)

`special_*` prefix 아이콘은 원본 색상을 유지하며, color prop이 적용되지 않습니다.

```tsx
// ✅ 올바른 사용 - 원본 색상 유지
<BZWIcon name="special_email" size="24" />

// ⚠️ color prop 무시됨
<BZWIcon name="special_email" size="24" color="blue700" /> // color 적용 안됨
```

**주요 special\_\* 아이콘:**

- `special_email` - 이메일 (파란색)
- `special_folder` - 폴더 (노란색)
- `special_file_excel` - 엑셀 파일 (초록색)
- `special_file_pdf` - PDF 파일 (빨간색)

## 매핑 실패 처리 방법

### 방법 1: 유사 아이콘 선택 (권장)

```tsx
// Figma 아이콘: IconSave
// 매칭 실패 → 유사한 'system_download' 사용
<BZWIcon name="system_download" /> {/* Figma: IconSave - 유사 아이콘 사용 */}
```

### 방법 2: Placeholder 아이콘

```tsx
// Figma 아이콘: IconUnknown
// 매칭 실패 → placeholder 사용
<BZWIcon name="system_exclamationmark" /> {/* Figma: IconUnknown - 매칭 실패 */}
```

### 방법 3: 디자이너에게 문의

```tsx
// TODO: 디자이너에게 적절한 아이콘 확인 필요
// Figma: IconCustomSpecial
<BZWIcon name="system_exclamationmark" /> {/* 임시 placeholder */}
```

## import 문 예시

### BZWIcon

```tsx
import BZWIcon from '@shared/ui/BZWIcon';

function MyComponent() {
  return (
    <div>
      <BZWIcon name='special_email' size='24' />
      <BZWIcon name='system_camera' size='20' color='gray700' />
    </div>
  );
}
```

### @jds/theme Icon

```tsx
import { Icon } from '@jds/theme';

function MyComponent() {
  return (
    <div>
      <Icon name='system_camera' size='24' color='gray700' />
      <Icon name='line_arrow_right' size='20' color='blue600' />
    </div>
  );
}
```

### 혼합 사용

```tsx
import BZWIcon from '@shared/ui/BZWIcon';
import { Icon } from '@jds/theme';

function MyComponent() {
  return (
    <div>
      {/* BZWIcon 우선 사용 */}
      <BZWIcon name='special_email' size='24' />
      <BZWIcon name='system_search' size='20' color='gray600' />

      {/* BZWIcon에 없는 경우 @jds/theme Icon 사용 */}
      <Icon name='line_info' size='16' color='blue600' />
    </div>
  );
}
```
