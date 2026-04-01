/**
 * Figma to Markdown - Parser Functions
 * Figma 기획서를 파싱하여 마크다운으로 변환
 */

// ============================================================================
// Types
// ============================================================================

export interface StateInfo {
  name: string;
  label: string;
  color: string;
  description?: string;
}

export interface StateFlow {
  from: string;
  to: string;
  event: string;
}

export interface StateUI {
  state: string;
  visible: string[];
  disabled: string[];
  actions: string[];
  note?: string;
}

export interface ParsedData {
  featureName: string;
  requirements: string[];
  states: StateInfo[];
  flows: StateFlow[];
  stateUIs: StateUI[];
}

// ============================================================================
// Core Parsing Functions
// ============================================================================

/**
 * 1. 요구사항 추출
 * Figma 텍스트에서 체크박스, 리스트 항목 추출
 */
export function extractRequirements(figmaData: unknown): string[] {
  const requirements: string[] = [];

  // figmaData를 순회하며 텍스트 노드 찾기
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traverse = (node: any) => {
    // TEXT 또는 STICKY 타입의 노드에서 텍스트 추출
    if ((node.type === 'TEXT' || node.type === 'STICKY') && node.characters) {
      const text = node.characters;
      const lines = text.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();

        // 체크박스 패턴 매칭: - [ ], - [x], * [ ] 등
        const checkboxMatch = trimmed.match(/^[\s-*]*\[(x| )\]\s*(.+)$/);
        if (checkboxMatch) {
          requirements.push(checkboxMatch[2].trim());
          continue;
        }

        // 번호 리스트 패턴: 1., 2., 3. 등
        const numberedMatch = trimmed.match(/^\d+\.\s+(.+)$/);
        if (numberedMatch) {
          requirements.push(numberedMatch[1].trim());
          continue;
        }

        // 대시 리스트 패턴: -, *, • 등
        const dashMatch = trimmed.match(/^[-*•]\s+(.+)$/);
        if (dashMatch) {
          // "요구사항", "기능" 등의 키워드가 포함된 섹션만
          const keywords = ['요구사항', '기능', 'feature', 'requirement'];
          const parentText = node.name || '';
          const isRequirementSection = keywords.some(
            kw => parentText.toLowerCase().includes(kw.toLowerCase()) || text.toLowerCase().includes(kw.toLowerCase()),
          );

          if (isRequirementSection) {
            requirements.push(dashMatch[1].trim());
          }
        }
      }
    }

    // 자식 노드 재귀 탐색
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  // 루트부터 탐색 시작
  if (figmaData.document) {
    traverse(figmaData.document);
  } else if (Array.isArray(figmaData)) {
    figmaData.forEach(traverse);
  } else {
    traverse(figmaData);
  }

  // 중복 제거
  return [...new Set(requirements)];
}

/**
 * 2. 상태 플로우 추출
 * CONNECTOR(화살표) 노드로 상태 간 전환 관계 파악
 */
export function extractStateFlow(figmaData: unknown): {
  flows: StateFlow[];
  states: StateInfo[];
} {
  const states: StateInfo[] = [];
  const flows: StateFlow[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateNodesMap = new Map<string, any>();

  // 1단계: 상태를 나타내는 노드 찾기 (STICKY, SHAPE 등)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traverse = (node: any) => {
    // 상태 노드 후보: STICKY 또는 특정 SHAPE
    const isStateNode =
      node.type === 'STICKY' || (node.type === 'RECTANGLE' && node.name) || (node.type === 'ELLIPSE' && node.name);

    if (isStateNode && node.characters) {
      stateNodesMap.set(node.id, node);
    }

    // CONNECTOR 타입: 화살표 연결
    if (node.type === 'CONNECTOR') {
      flows.push({
        from: node.startNodeId || '',
        to: node.endNodeId || '',
        event: node.label || node.name || 'transition',
      });
    }

    // 자식 노드 재귀
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  if (figmaData.document) {
    traverse(figmaData.document);
  } else if (Array.isArray(figmaData)) {
    figmaData.forEach(traverse);
  } else {
    traverse(figmaData);
  }

  // 2단계: 연결된 노드들을 states로 변환
  const connectedNodeIds = new Set<string>();
  flows.forEach(flow => {
    connectedNodeIds.add(flow.from);
    connectedNodeIds.add(flow.to);
  });

  connectedNodeIds.forEach(nodeId => {
    const node = stateNodesMap.get(nodeId);
    if (node) {
      // 노드 텍스트에서 상태명 추출
      const text = node.characters || node.name || '';
      const lines = text.split('\n');

      // 첫 줄: label, 괄호 안: name
      const label = lines[0]?.trim() || '';
      const nameMatch = text.match(/\(([a-zA-Z_]+)\)/);
      const name = nameMatch ? nameMatch[1] : label.toLowerCase().replace(/\s+/g, '_');

      // 색상 추출
      let color = 'gray';
      if (node.fills && node.fills[0] && node.fills[0].color) {
        const rgb = node.fills[0].color;
        color = rgbToColorName(rgb);
      }

      states.push({
        name,
        label,
        color,
      });
    }
  });

  return { flows, states };
}

/**
 * 3. 상태별 UI 구조 추출
 * 각 상태에서 표시/비활성화되는 UI 요소 파악
 */
export function extractStateUI(figmaData: unknown, states: StateInfo[]): StateUI[] {
  const stateUIs: StateUI[] = [];

  // 각 상태별로 관련 텍스트 찾기
  for (const state of states) {
    const ui: StateUI = {
      actions: [],
      disabled: [],
      state: state.name,
      visible: [],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (node: any) => {
      if ((node.type === 'TEXT' || node.type === 'STICKY') && node.characters) {
        const text = node.characters.toLowerCase();
        const name = (node.name || '').toLowerCase();

        // 이 노드가 특정 상태와 관련있는지 확인
        const isRelated =
          text.includes(state.label.toLowerCase()) ||
          text.includes(state.name.toLowerCase()) ||
          name.includes(state.label.toLowerCase()) ||
          name.includes(state.name.toLowerCase());

        if (isRelated) {
          // "표시", "보여주기" 등의 키워드
          if (text.includes('표시') || text.includes('보여') || text.includes('활성')) {
            const lines = node.characters.split('\n');
            lines.forEach(line => {
              const trimmed = line.trim();
              if (trimmed && !trimmed.includes(state.label)) {
                ui.visible.push(trimmed);
              }
            });
          }

          // "비활성화", "숨김" 등의 키워드
          if (text.includes('비활성') || text.includes('숨김') || text.includes('disable')) {
            const lines = node.characters.split('\n');
            lines.forEach(line => {
              const trimmed = line.trim();
              if (trimmed && !trimmed.includes(state.label)) {
                ui.disabled.push(trimmed);
              }
            });
          }

          // "버튼", "액션" 등의 키워드
          if (text.includes('버튼') || text.includes('액션') || text.includes('action')) {
            const lines = node.characters.split('\n');
            lines.forEach(line => {
              const trimmed = line.trim();
              if (trimmed && trimmed.includes('버튼')) {
                ui.actions.push(trimmed);
              }
            });
          }
        }
      }

      // 자식 노드 재귀
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(traverse);
      }
    };

    if (figmaData.document) {
      traverse(figmaData.document);
    } else if (Array.isArray(figmaData)) {
      figmaData.forEach(traverse);
    } else {
      traverse(figmaData);
    }

    stateUIs.push(ui);
  }

  return stateUIs;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * RGB 색상을 이름으로 변환
 */
function rgbToColorName(rgb: { b: number; g: number; r: number }): string {
  const { b, g, r } = rgb;

  // 회색 계열
  if (Math.abs(r - g) < 0.1 && Math.abs(g - b) < 0.1) {
    if (r < 0.3) return 'dark-gray';
    if (r < 0.6) return 'gray';
    return 'light-gray';
  }

  // 주요 색상
  if (r > 0.7 && g < 0.3 && b < 0.3) return 'red';
  if (g > 0.7 && r < 0.3 && b < 0.3) return 'green';
  if (b > 0.7 && r < 0.3 && g < 0.3) return 'blue';
  if (r > 0.7 && g > 0.7 && b < 0.3) return 'yellow';
  if (r > 0.7 && g < 0.5 && b > 0.7) return 'purple';
  if (r < 0.3 && g > 0.7 && b > 0.7) return 'cyan';

  return 'gray';
}

/**
 * 기능명 추출 (문서 제목 등에서)
 */
export function extractFeatureName(figmaData: unknown): string {
  // 문서 이름, 첫 번째 큰 텍스트 등에서 추출
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((figmaData as any).name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (figmaData as any).name;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((figmaData as any).document && (figmaData as any).document.name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (figmaData as any).document.name;
  }

  // 첫 번째 큰 텍스트 노드 찾기
  let largestText = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const traverse = (node: any) => {
    if (node.type === 'TEXT' && node.characters) {
      const fontSize = node.fontSize || 0;
      if (fontSize > 24 && node.characters.length < 50) {
        largestText = node.characters;
        return;
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((figmaData as any).document) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    traverse((figmaData as any).document);
  }

  return largestText || 'Feature';
}
