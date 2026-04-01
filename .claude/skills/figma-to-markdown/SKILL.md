---
name: figma-to-markdown
description: Figma 기획서를 UI 로직 마크다운 문서로 자동 변환 (요구사항, 상태 플로우, UI 구조 정리)
---

# 📝 Figma to Markdown Converter

You are tasked with converting a Figma specification document to a structured Markdown UI logic document.

The user will provide a Figma URL. Follow these steps to create a well-structured UI logic documentation.

## Step 1: Parse Figma URL

Extract `fileKey` and `nodeId` from the provided URL.

**URL format examples:**

- `https://figma.com/design/:fileKey/:fileName?node-id=123-456`
- `https://figma.com/board/:fileKey/:fileName?node-id=789-012`

**Extraction:**

- `fileKey`: Path segment at position 2 (e.g., "uy4pUNV15IRjwQ7SL3FaO8")
- `nodeId`: Convert node-id parameter from dash to colon format (e.g., "123-456" → "123:456")

## Step 2: Fetch Figma Data

Use the Figma MCP tool to fetch the design context:

```typescript
mcp__figma__get_design_context({
  fileKey: extractedFileKey,
  nodeId: extractedNodeId,
  clientLanguages: 'typescript',
  clientFrameworks: 'react',
});
```

## Step 3: Analyze and Extract Content

From the Figma data, extract:

### 3.1 Feature Name

- Document title or main heading
- Use for file name generation

### 3.2 Requirements

Look for:

- Checklist items (`- [ ]`, `- [x]`)
- Numbered lists near keywords: "요구사항", "기능", "Feature", "Requirement"
- Bullet points in requirement sections

### 3.3 State Flow (if applicable)

Look for:

- State nodes (sticky notes, shapes with state names)
- Connectors (arrows) between states
- State transition events (arrow labels)
- State colors (for visual grouping)

### 3.4 UI Structure (if applicable)

Look for:

- Buttons and their states
- Form fields and validation rules
- Display rules based on conditions
- Access control rules

### 3.5 Information Exposure Policy (if applicable)

Look for:

- Field-level access rules
- Conditional display based on user actions (e.g., acceptance, sending)
- Privacy settings and masking rules

## Step 4: Generate Markdown Structure

Create a markdown document with this structure:

```markdown
# UI 로직: {Feature Name}

> 📅 생성일: {Current Date}
> 📎 Figma 링크: [기획서]({Original Figma URL})

## 📋 주요 기능

{List of extracted requirements as checklist items}

## 🔄 상태 플로우 (if states exist)

{State definitions and flow diagrams using Mermaid}

## 🎨 상태별 UI 구조 (if state-based UI exists)

{UI structure for each state}

## 📋 정보 노출 정책 (if access control exists)

{Organize by categories, then show before/after rules within each field}

### {Category 1}

#### {Field 1}

- **수락 전**: {exposure rule before acceptance}
- **수락 후**: {exposure rule after acceptance}
- **입력 정책**: {input policy}
- **필수**: {O or X}

## 💡 비즈니스 로직

{Business rules and logic}

## 📌 TODO

- [ ] API 엔드포인트 확인 필요
- [ ] 권한 체크 로직 정의 필요
- [ ] {Add more TODOs for uncertain items}
```

## Step 5: Apply Documentation Guidelines

**CRITICAL RULES:**

1. **NO Design Elements**
   - Remove all color codes, font sizes, style specifications
   - Focus only on functional/behavioral aspects
   - Example: "파란색 버튼" → "버튼"

2. **Mark Uncertain Content**
   - Add `TODO:` prefix for any inferred or uncertain information
   - Example: `TODO: 클릭 시 동작 확인 필요 (모달? 페이지 이동?)`

3. **Avoid Duplication**
   - Each piece of information should appear only once
   - Consolidate related sections
   - Remove redundant explanations

4. **Structure by Category First**
   - For information exposure policies, organize by field categories (기본 정보, 경력 정보, etc.)
   - Within each field, show before/after acceptance rules
   - Include input policy and required status with each field

5. **Be Explicit About Sources**
   - Only include information clearly visible in Figma
   - Don't speculate or infer behavior
   - When in doubt, add TODO instead

## Step 6: Save the Document

Save the generated markdown to:

```
docs/ui-logic/{feature-name-kebab-case}.md
```

Where `feature-name-kebab-case` is the feature name converted to lowercase with hyphens.

## Step 7: Summary

After saving, provide a summary:

```
✅ 마크다운 생성 완료!

📄 파일: docs/ui-logic/{filename}.md
📊 통계:
  - 라인 수: {count}
  - 섹션 수: {count}
  - TODO 항목: {count}

⚠️ 다음 단계:
  1. 생성된 문서 검토 및 수정
  2. TODO 항목 처리
  3. 디자인 요소 제거 확인
  4. 중복 내용 제거 확인
  5. 구조 검토 (카테고리 → 필드 → 수락 전/후)
```

## Example Output Structure

For an applicant management feature with state flow:

```markdown
# UI 로직: 지원자 관리

> 📅 생성일: 2026-01-07
> 📎 Figma 링크: [지원자 관리 기획](...)

## 📋 주요 기능

- [ ] 지원자 목록 조회
- [ ] 지원자 상태 변경
- [ ] 지원자 정보 수정

## 🔄 상태 플로우

### 상태 정의

- **대기** (`pending`): 초기 접수 상태
- **검토중** (`reviewing`): 담당자 검토 중
- **승인** (`approved`): 최종 승인
- **거절** (`rejected`): 거절됨

### 상태 전환 다이어그램

\`\`\`mermaid
graph LR
pending[대기] -->|검토 시작| reviewing[검토중]
reviewing -->|승인| approved[승인]
reviewing -->|거절| rejected[거절]
\`\`\`

## 🎨 상태별 UI 구조

### 상태: 대기 (`pending`)

**표시 요소:**

- 상태 배지 "대기"
- 지원자 기본 정보

**액션 버튼:**

- 검토 시작

**비활성화:**

- 승인 버튼
- 거절 버튼

---

### 상태: 검토중 (`reviewing`)

**표시 요소:**

- 상태 배지 "검토중"
- 지원자 전체 정보

**액션 버튼:**

- 승인
- 거절

## 💡 비즈니스 로직

### 상태 전환 규칙

- 대기 → 검토중: 담당자 배정 시 자동 전환
- 검토중 → 승인/거절: 관리자 권한 필요
- 승인/거절 → 다른 상태: 불가능 (최종 상태)

## 📌 TODO

- [ ] API 엔드포인트 확인 필요
- [ ] 권한 체크 로직 정의 필요
- [ ] TODO: 알림 발송 여부 확인 필요
```

## Notes

- Be thorough but concise
- Maintain consistent formatting
- Use Korean for content, English for code/technical terms
- Always verify information before including it
- When uncertain, use TODO markers
