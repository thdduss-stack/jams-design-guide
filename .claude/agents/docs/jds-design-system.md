# JDS 디자인 시스템 레퍼런스

> JK HiringCenter 디자인 시스템 규칙. 모든 UI 생성 시 이 문서를 기준으로 합니다.
> Design System 사이트: https://coololivia.github.io/jams-design-system/
> 상세 시스템 계층 구조: `.claude/agents/docs/jams-system-overview.md`
> BizJAMS HC 전용 토큰: `.claude/agents/docs/bizjams-tokens.md`
> 컬러 팔레트 전체: `.claude/agents/docs/jams-color-palette.md`
> 타이포그래피: `.claude/agents/docs/jams-typography.md`
> 테마 시스템: `.claude/agents/docs/jams-themes.md`
> 스페이싱/라디우스/그림자: `.claude/agents/docs/jams-spacing-radius-shadow.md`
> 버튼 스펙: `.claude/agents/docs/jams-button-specs.md`
> QA 체크리스트: `.claude/agents/docs/jams-qa-checklist.md`

## 이 프로젝트의 시스템 위치

**HC 채용담당자 화면 → BizJAMS** 기준 적용
- Primary: `blue.500` = `#2684FF` (BizJAMS) ← `#1B55F6`(CommJAMS JK blue2.500)
- Border Radius: 버튼 6px, 카드 8px (CommJAMS보다 각짐)

> ⚠️ 구버전 `#0060CC` = blue.600 (hover), `#0057FF` 사용 금지

## 듀얼 브랜드

| 브랜드 | Primary | Tailwind |
|--------|---------|---------|
| 잡코리아 | 파랑 | `bg-blue-500`, `text-blue-500` |
| 알바몬 | 주황 | `bg-orange-500`, `text-orange-500` |

CSS 변수 기반이므로 `data-jds-theme="jobkorea"` / `data-jds-theme="albamon"` 속성으로 전환됩니다.

## Tailwind 커스텀 스케일 (이 프로젝트 전용)

> ⚠️ 기본 Tailwind와 다릅니다. 반드시 이 스케일 사용.

### spacing (px 기반)
```
gap-0, gap-2, gap-4, gap-6, gap-8, gap-10, gap-12, gap-13, gap-14,
gap-16, gap-20, gap-24, gap-28, gap-32, gap-40, gap-48, gap-52,
gap-56, gap-60, gap-72, gap-80
```
→ `gap-4` = **4px** (기본 Tailwind gap-4 = 16px와 다름!)

### borderRadius
```
rounded-0, rounded-2, rounded-4, rounded-6, rounded-8,
rounded-12, rounded-16, rounded-20, rounded-24, rounded-999
```
→ `rounded-999` 사용 (rounded-full ❌)

### fontSize (lineHeight, letterSpacing 자동 연동)
```
text-11, text-12, text-13, text-14, text-15, text-16,
text-18, text-20, text-24, text-28, text-32, text-36
```

### fontWeight
```
font-regular (400), font-medium (500), font-semibold (600), font-bold (700)
```

## JDS 컴포넌트 전체 목록 (@jds/theme)

### 폼 (HTML 네이티브 대신 필수 사용)

| HTML | JDS 컴포넌트 |
|------|-------------|
| `<button>` | `<Button>` |
| `<input type="text">` | `<TextField.Root><TextField.Input /></TextField.Root>` |
| `<input type="checkbox">` | `<Checkbox>` |
| `<input type="radio">` | `<RadioGroup.Root><RadioGroup.Item /></RadioGroup.Root>` |
| `<select>` | `<SelectBox.Root><SelectBox.Trigger /><SelectBox.Content /></SelectBox.Root>` |

```typescript
import { Button, TextField, Checkbox, RadioGroup, SelectBox } from '@jds/theme';
```

### 오버레이

```typescript
import { Dialog, AlertDialog, DropdownMenu, ContextMenu, Popover, Tooltip } from '@jds/theme';
```

### 네비게이션

```typescript
import { Tabs, NavigationMenu, MenuBar, Carousel } from '@jds/theme';
```

### 레이아웃

```typescript
import { Accordion, Collapsible, AspectRatio } from '@jds/theme';
```

### 피드백

```typescript
import { Toast, MrNotification } from '@jds/theme';
```

### 토글

```typescript
import { Toggle, ToggleGroup } from '@jds/theme';
```

## 아이콘 규칙

**BZWIcon 우선**, 없을 때만 `@jds/theme` Icon:

```typescript
// 1순위: BZWIcon special_*
import BZWIcon from '@shared/ui/BZWIcon';
<BZWIcon name="special_flight" size="16" />

// 2순위: BZWIcon system_*
<BZWIcon name="system_mail" size="16" />

// 3순위: @jds/theme Icon (BZWIcon에 없을 때만)
import { Icon } from '@jds/theme';
<Icon name="system_check" size="16" />
```

새로운 아이콘 패키지 설치 금지.

## 색상 역할 (Semantic)

| 역할 | Tailwind 클래스 |
|------|----------------|
| 주요 텍스트 | `text-typography-primary` |
| 보조 텍스트 | `text-typography-secondary` |
| 비활성 텍스트 | `text-typography-disabled` |
| Primary 버튼 | `bg-button-primary` |
| 구분선 | `border-line-normal` |
| 박스 배경 | `bg-box-normal` |

## 해상도

- **데스크톱 전용**: min-width 1038px ~ max-width 1856px
- 모바일/태블릿 breakpoint 없음 (이 프로젝트 범위 외)

## 폰트

- Pretendard

## 금지 패턴

```typescript
// ❌ 금지
<button>클릭</button>
<input type="text" />
<select>...</select>
style={{ color: '#1B55F6' }}  // inline style
className="rounded-full"       // rounded-full 대신 rounded-999
gap-4  // 의미: 4px (혼동 주의)

// ✅ 허용
<Button variant="primary">클릭</Button>
<TextField.Root><TextField.Input /></TextField.Root>
className="rounded-999 text-14 font-semibold gap-16"
```
