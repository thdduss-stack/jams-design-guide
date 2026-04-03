# BizJAMS 토큰 레퍼런스 (HC 전용)

> 이 프로젝트(jk-hiringcenter-design-web)는 BizJAMS 기반입니다.
> 출처: JAMS 디자인시스템 개발자 구현 가이드 (2026-04-03)
> Token Source: `src/lib/bizjams-c.ts`

## Import

```typescript
import { palette, typography, fontWeight, tokens } from '@/lib/bizjams-c';
```

## 색상 (BizJAMS)

### Primary

```typescript
tokens.color.primary         // #0060CC ← BizJAMS Primary (⚠️ #0057FF 아님)
tokens.color.primaryHover    // #0049A3
tokens.color.link            // #435EFF
```

### 텍스트

```typescript
tokens.color.text            // #222222 — gray900 (주요 텍스트)
tokens.color.textSecondary   // #6A6A6A — gray700 (보조 텍스트)
tokens.color.textDescription // #9E9E9E — gray500 (⚠️ 기존 #999에서 변경)
```

### 배경

```typescript
tokens.color.bg              // #FFFFFF
tokens.color.bgPage          // #F3F4F6
tokens.color.bgSelected      // #F0F5FF — 선택 옵션
```

### 보더

```typescript
tokens.color.border          // #E8E8E8 — gray200
tokens.color.borderSecondary // #F4F4F4 — gray100
tokens.color.borderInput     // #BFBFBF — gray400
tokens.color.borderBtn       // #D2D2D2 — gray300
```

### 기타

```typescript
tokens.color.divider         // #EEF0F4 — 헤더 구분선
tokens.color.tagBg           // #F4F4F4
tokens.color.tagText         // #444444
tokens.color.btnDark         // #222222
```

### Palette 직접 참조

```typescript
palette.gray[50]   // #F7F7F7 — 배경
palette.gray[100]  // #F4F4F4 — 카드, 비활성
palette.gray[200]  // #E8E8E8 — border
palette.gray[400]  // #BFBFBF — Input border
palette.gray[500]  // #9E9E9E — placeholder
palette.gray[700]  // #6A6A6A — 보조 텍스트
palette.gray[900]  // #222222 — 주요 텍스트
```

## 타이포그래피 (BizJAMS)

> ⚠️ 모든 Heading fontWeight: 600. 700 절대 금지.
> ⚠️ 기존 `size14-bold(700)` → `body-M-semibold(600)`으로 교체.

```typescript
typography.H3                    // { fontSize:20, lineHeight:28, fontWeight:600 }
typography.H4                    // { fontSize:18, lineHeight:26, fontWeight:600 }
typography['body-L-semibold']    // { fontSize:16, lineHeight:24, fontWeight:600 }
typography['body-M-semibold']    // { fontSize:14, lineHeight:20, fontWeight:600 }
typography['body-M-medium']      // { fontSize:14, lineHeight:20, fontWeight:500 }
typography['body-M-regular']     // { fontSize:14, lineHeight:20, fontWeight:400 }
typography['body-S-semibold']    // { fontSize:12, lineHeight:16, fontWeight:600 }
typography['body-S-regular']     // { fontSize:12, lineHeight:16, fontWeight:400 }
typography['metric-L']           // { fontSize:28, lineHeight:38, fontWeight:600 } — 숫자·통계
```

### 자주 쓰는 조합

```typescript
// 테이블 헤더
{ ...typography['body-M-semibold'], color: palette.gray[900] }

// 이름, 학력, 경력
{ ...typography['body-M-medium'], color: palette.gray[900] }

// 나이, 날짜
{ ...typography['body-M-regular'], color: palette.gray[900] }

// 보조 텍스트
{ ...typography['body-S-regular'], color: palette.gray[500] }
```

## 간격 (BizJAMS — compact)

```typescript
tokens.chip.paddingX    // 16px — 칩 좌우 패딩
tokens.chip.gap         // 6px  — 칩 내부 gap
tokens.chip.iconSize    // 14px — 칩 아이콘 크기
```

## Radius (BizJAMS — 더 각짐)

> ⚠️ CommJAMS와 다름 — 혼용 금지

```typescript
tokens.radius.sm    // 4px  — 태그
tokens.radius.md    // 6px  — 버튼·인풋 기본 (BizJAMS 기준)
radius[999]         // 999px — 필터 칩 (pill)
```

| CommJAMS JK | CommJAMS AM | **BizJAMS** |
|------------|------------|------------|
| 버튼: 10px | 버튼: 16px | 버튼: **6px** |
| 카드: 12px | 카드: 16px | 카드: **8px** |

## Height 토큰

```typescript
tokens.height.sm    // 32px — 소형 버튼, 칩
tokens.height.md    // 36px — 중형
tokens.height.lg    // 40px — 기본 버튼, 인풋
```

## 헤더 버튼 토큰

```typescript
tokens.header.proposeBtnPaddingX  // 12px
tokens.header.proposeBtnRadius    // 6px
tokens.header.proposeBtnFontSize  // 13px
```

## 레이아웃 (BizJAMS 1440px 기준)

```
D-BZWHeader (48px) + D-BZWSider (64px) + Body (1376px)
```

### HC 인재 테이블 그리드

```typescript
gridTemplateColumns: '180px 1fr 1fr 200px 240px'
```

### HC 아코디언 행

```typescript
gridTemplateColumns: '28px 72px 1fr 60px 120px'
```

### 특수 레이아웃

```typescript
// ProposeDrawer (우측)
width: 480

// ChargeModal
// 1300px 이상: { width: 800 }
// 1300px 미만: { width: 800, height: '100vh', borderRadius: 0 }
```

## 이름 마스킹 (BizJAMS 필수)

```typescript
// accepted 상태: 전체 이름 노출
// 나머지 모든 상태: 성** 처리
function maskName(name: string): string {
  return name[0] + '**';
}
```

## BizJAMS QA 체크리스트

- [ ] `tokens.color.primary` = `#0060CC` (기존 `#0057FF` 아님 ⚠️)
- [ ] `gray500` = `#9E9E9E` (기존 `#999` 아님 ⚠️)
- [ ] Heading `fontWeight` **600** (700 금지)
- [ ] `body-M-bold` 없음 → `body-M-semibold` 사용
- [ ] 이름 마스킹 적용 (`maskName()`)
- [ ] 테이블: `gridTemplateColumns` 사용 (flex 금지)
- [ ] `"use client"` 선언
- [ ] Ant Design 6.x 호환 확인

## 컴포넌트 패턴 (BizJAMS)

### Primary 버튼

```typescript
// Tailwind 변환 기준: h-40 px-20 rounded-[6px] bg-[#0060CC] text-white
const btnPrimary = {
  height: tokens.height.lg,       // 40px
  padding: '0 20px',
  background: tokens.color.primary, // #0060CC ⚠️
  color: '#ffffff',
  border: 'none',
  borderRadius: tokens.radius.sm,  // 4px (토큰) or 6px
  ...typography['body-M-semibold'],
  cursor: 'pointer',
};
// disabled
// background: palette.gray[200], color: palette.gray[400], cursor: 'not-allowed'
```

### 필터 칩

```typescript
// isActive에 따라 스타일 분기
// h-32 px-16 rounded-999 border border-[tokens.color.border]
// active: bg-[tokens.color.bgSelected] text-[tokens.color.primary] font-semibold
// inactive: bg-white text-[tokens.color.text] font-regular
```

### 태그

```typescript
// bg-[tokens.color.tagBg] text-[tokens.color.tagText]
// rounded-[4px] text-12 font-semibold px-6 py-1
```

### 인풋

```typescript
// h-40 border border-[tokens.color.borderInput] rounded-[4px] px-12
// focus: border-[tokens.color.primary]
// error: border-[#ef4343]
// disabled: bg-[palette.gray[50]] text-[palette.gray[400]]
```
