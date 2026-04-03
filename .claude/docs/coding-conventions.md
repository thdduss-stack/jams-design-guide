# 코딩 컨벤션 레퍼런스

> 이 프로젝트의 코드 작성 규칙. QA 및 코드 생성 시 기준으로 사용.

## TypeScript

```typescript
// ✅ 명확한 interface 정의
interface JobCardProps {
  title: string;
  company: string;
  deadline: string;
}

// ❌ any 타입 금지
function process(data: any) { ... }
```

## React 패턴

```tsx
// ✅ useState 직접 import (React 19)
import { useState, useCallback } from 'react';

// ❌ React.useState 금지
const [count, setCount] = React.useState(0);

// ✅ 핸들러 함수 분리
const handleButtonClick = useCallback(() => { ... }, []);
<Button onClick={handleButtonClick}>클릭</Button>

// ❌ inline function 금지
<Button onClick={() => { ... }}>클릭</Button>
```

## 스타일

```tsx
// ✅ Tailwind 클래스
<div className="flex flex-col gap-16 rounded-8 bg-box-normal p-24">

// ❌ inline style 금지
<div style={{ display: 'flex', flexDirection: 'column' }}>

// ✅ 레이아웃에서 gap 사용
<div className="flex flex-col gap-16">

// ❌ margin/padding으로 간격 조정 지양
<div className="mt-16 mb-8">
```

## 금지 패턴 전체 목록

| 금지 | 대안 |
|------|------|
| `any` 타입 | 명확한 interface 정의 |
| `<button>`, `<input>`, `<select>` | `@jds/theme` 컴포넌트 |
| inline style | Tailwind 클래스 |
| `React.useState` | `useState` 직접 import |
| inline function | `handleXxx` 함수 분리 |
| 배럴 파일(index.ts) | 직접 파일 경로 |
| `rounded-full` | `rounded-999` |
| 외부 CDN | 로컬 assets |
| alt 텍스트 누락 | 반드시 alt/aria-label |
| 새 아이콘 패키지 설치 | BZWIcon / @jds/theme Icon |

배럴 파일 금지 예시:
```typescript
// ❌
import { Company } from '@core/domain/company';

// ✅
import { Company } from '@core/domain/company/entities';
```

## 이미지/접근성

```tsx
// ✅ alt 필수
<img src={logo} alt="잡코리아 로고" />
<Icon name="system_search" aria-label="검색" />

// ❌ alt 누락 금지
<img src={logo} />
```

## 커밋 컨벤션

```
feat | fix | docs | style | modify | refactor | test | chore | remove | rename
```

형식: `type: Subject` (한국어 Subject 권장)

예시:
```
feat: 채용공고 필터 컴포넌트 추가
fix: 지원자 목록 페이지네이션 버그 수정
modify: 회사 카드 레이아웃 조정
```
