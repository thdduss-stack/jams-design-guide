/**
 * Figma to Markdown - Markdown Generator
 * 파싱된 데이터를 마크다운 형식으로 변환
 */

import type { ParsedData, StateFlow, StateInfo, StateUI } from './parser';

/**
 * 마크다운 문서 생성
 */
export function generateMarkdown(data: ParsedData): string {
  const sections: string[] = [];

  // 제목
  sections.push(`# UI 로직: ${data.featureName}\n`);

  // 요구사항 섹션
  sections.push(generateRequirementsSection(data.requirements));

  // 상태 플로우 섹션
  if (data.states.length > 0) {
    sections.push(generateStateFlowSection(data.states, data.flows));
  }

  // 상태별 UI 구조 섹션
  if (data.stateUIs.length > 0) {
    sections.push(generateStateUISection(data.stateUIs, data.states));
  }

  // TODO 섹션
  sections.push(generateTodoSection());

  return sections.join('\n\n');
}

/**
 * 요구사항 섹션 생성
 */
function generateRequirementsSection(requirements: string[]): string {
  if (requirements.length === 0) {
    return `## 📋 요구사항

_기획서에서 요구사항을 찾지 못했습니다._`;
  }

  const items = requirements.map(req => `- [ ] ${req}`).join('\n');

  return `## 📋 요구사항

${items}`;
}

/**
 * 상태 플로우 섹션 생성
 */
function generateStateFlowSection(states: StateInfo[], flows: StateFlow[]): string {
  // 상태 정의
  const stateDefinitions = states
    .map(s => {
      const desc = s.description ? `: ${s.description}` : '';
      return `- **${s.label}** (\`${s.name}\`)${desc}`;
    })
    .join('\n');

  // 상태 전환 다이어그램 (Mermaid)
  const mermaidDiagram = generateMermaidDiagram(states, flows);

  // 텍스트 플로우
  const textFlow = generateTextFlow(states, flows);

  return `## 🔄 상태 플로우

### 상태 정의

${stateDefinitions}

### 상태 전환 다이어그램

\`\`\`mermaid
${mermaidDiagram}
\`\`\`

### 전환 흐름

${textFlow}`;
}

/**
 * Mermaid 다이어그램 생성
 */
function generateMermaidDiagram(states: StateInfo[], flows: StateFlow[]): string {
  const lines: string[] = ['graph LR'];

  // 상태 노드 정의
  states.forEach(state => {
    const nodeId = state.name;
    const label = state.label;
    lines.push(`  ${nodeId}[${label}]`);
  });

  // 전환 화살표
  flows.forEach(flow => {
    const fromState = states.find(s => s.name === flow.from);
    const toState = states.find(s => s.name === flow.to);

    if (fromState && toState) {
      lines.push(`  ${flow.from} -->|${flow.event}| ${flow.to}`);
    }
  });

  return lines.join('\n');
}

/**
 * 텍스트 플로우 생성
 */
function generateTextFlow(states: StateInfo[], flows: StateFlow[]): string {
  if (flows.length === 0) {
    return '_상태 전환 정보를 찾지 못했습니다._';
  }

  // 시작 상태 찾기 (들어오는 화살표가 없는 상태)
  const outgoingStates = new Set(flows.map(f => f.from));
  const incomingStates = new Set(flows.map(f => f.to));
  const startStates = [...outgoingStates].filter(s => !incomingStates.has(s));

  if (startStates.length === 0 && states.length > 0) {
    // 시작 상태가 명확하지 않으면 첫 번째 상태 사용
    startStates.push(states[0].name);
  }

  // 각 시작 상태부터 플로우 생성
  const flowPaths: string[] = [];

  startStates.forEach(startState => {
    const path = buildFlowPath(startState, flows, states, new Set());
    if (path) {
      flowPaths.push(path);
    }
  });

  return flowPaths.join('\n\n');
}

/**
 * 재귀적으로 플로우 경로 생성
 */
function buildFlowPath(
  currentState: string,
  flows: StateFlow[],
  states: StateInfo[],
  visited: Set<string>,
  depth: number = 0,
): string {
  if (visited.has(currentState) || depth > 10) {
    return '';
  }

  visited.add(currentState);

  const state = states.find(s => s.name === currentState);
  if (!state) return '';

  const outgoingFlows = flows.filter(f => f.from === currentState);

  if (outgoingFlows.length === 0) {
    // 최종 상태
    return state.label;
  }

  if (outgoingFlows.length === 1) {
    // 단일 전환
    const flow = outgoingFlows[0];
    const nextPath = buildFlowPath(flow.to, flows, states, visited, depth + 1);
    return `${state.label} → ${nextPath}`;
  }

  // 다중 전환 (분기)
  const branches = outgoingFlows
    .map(flow => {
      const nextPath = buildFlowPath(flow.to, flows, states, new Set(visited), depth + 1);
      return `${flow.event}: ${nextPath}`;
    })
    .join(' / ');

  return `${state.label} → (${branches})`;
}

/**
 * 상태별 UI 구조 섹션 생성
 */
function generateStateUISection(stateUIs: StateUI[], states: StateInfo[]): string {
  const sections = stateUIs.map(ui => {
    const state = states.find(s => s.name === ui.state);
    const stateLabel = state?.label || ui.state;
    const stateColor = state?.color || 'gray';

    const parts: string[] = [`### 상태: ${stateLabel} (\`${ui.state}\`)`, ''];

    // 상태 배지 정보
    parts.push(`**상태 배지**: ${stateColor} 계열, "${stateLabel}"`);
    parts.push('');

    // 표시 요소
    if (ui.visible.length > 0) {
      parts.push('**표시 요소:**');
      ui.visible.forEach(item => {
        parts.push(`- ${item}`);
      });
      parts.push('');
    }

    // 액션 버튼
    if (ui.actions.length > 0) {
      parts.push('**액션 버튼:**');
      ui.actions.forEach(action => {
        parts.push(`- ${action}`);
      });
      parts.push('');
    }

    // 비활성화 요소
    if (ui.disabled.length > 0) {
      parts.push('**비활성화:**');
      ui.disabled.forEach(item => {
        parts.push(`- ${item}`);
      });
      parts.push('');
    }

    // 추가 노트
    if (ui.note) {
      parts.push(`**참고:** ${ui.note}`);
      parts.push('');
    }

    return parts.join('\n');
  });

  return `## 🎨 상태별 UI 구조

${sections.join('\n---\n\n')}`;
}

/**
 * TODO 섹션 생성
 */
function generateTodoSection(): string {
  return `## 📌 TODO

- [ ] API 엔드포인트 확인 필요
- [ ] 권한 체크 로직 정의 필요
- [ ] 에러 처리 방식 결정 필요
- [ ] 상태 전환 규칙 검증 필요`;
}

/**
 * 파일명 생성 (kebab-case)
 */
export function generateFileName(featureName: string): string {
  return featureName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 파일 경로 생성
 */
export function generateFilePath(featureName: string): string {
  const fileName = generateFileName(featureName);
  return `docs/ui-logic/${fileName}.md`;
}
