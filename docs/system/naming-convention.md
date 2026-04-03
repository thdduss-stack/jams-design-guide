# DTCG 토큰 네이밍 컨벤션

> 확정일: 2026-04-02

## 4가지 원칙

1. **카테고리가 앞에** — 무엇인지 바로 보임
2. **theme- prefix 제거** — 모든 토큰은 이미 테마에 속함
3. **3단계 이내** — 깊어질수록 파악이 어려워짐
4. **의미 중심** — 시각적 역할이 이름에서 바로 보여야 함

## 토큰 이름 구조: `카테고리.역할.변형`

### 예시
- `color.bg.interactive` — 버튼 primary 배경
- `color.text.primary` — 주요 텍스트
- `color.border.default` — 기본 테두리
- `radius.component.md` — 버튼·인풋 기본 radius
- `button.filled.primary.sm` — 버튼 컴포넌트 토큰

## 3-Layer 구조

### 1. Primitive — 순수 값
`color.gray.50`, `color.blue2.500`, `spacing.16`, `radius.10`

### 2. Semantic — 역할 기반
`color.bg.base`, `color.text.primary`, `space.component.md`, `radius.component.pill`

### 3. Component — 컴포넌트 토큰
`button.filled.primary.sm`, `button.outlined.default.md`

## 테마 Override

| Semantic 토큰 | CommJAMS JK | CommJAMS AM | BizJAMS |
|---------------|-------------|-------------|---------|
| `color.bg.interactive` | `#1B55F6` | `#FF6D12` | `#0060CC` |
| `radius.component.md` | 10px | 16px | 6px |
