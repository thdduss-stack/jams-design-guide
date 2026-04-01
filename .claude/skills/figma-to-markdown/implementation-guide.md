# 구현 가이드

핵심 함수 3개만 구현하면 바로 사용할 수 있습니다!

## 🎯 구현할 함수 (총 3개, 각 5-10줄)

### 1. extractRequirements() - 요구사항 추출

**입력:** Figma 텍스트 노드들
**출력:** 요구사항 문자열 배열

```typescript
function extractRequirements(figmaData: any): string[] {
  const requirements: string[] = [];

  // TODO: 여기에 구현
  // 1. figmaData에서 TEXT, STICKY 노드 찾기
  // 2. "요구사항", "기능" 키워드 있는 노드 찾기
  // 3. 체크박스 패턴 매칭: - [ ], - [x]
  // 4. 리스트 항목 추출

  // 예시 구현 (간단 버전):
  // for (const node of figmaData.nodes) {
  //   if (node.type === 'TEXT' && node.characters) {
  //     const lines = node.characters.split('\n');
  //     for (const line of lines) {
  //       if (line.match(/^[\s-*\d.[\]x]*\s*(.+)$/)) {
  //         requirements.push(line.trim());
  //       }
  //     }
  //   }
  // }

  return requirements;
}
```

### 2. extractStateFlow() - 상태 플로우 추출

**입력:** Figma 노드들
**출력:** 상태 정보 + 전환 규칙

```typescript
interface StateInfo {
  name: string;
  label: string;
  color: string;
}

interface StateFlow {
  from: string;
  to: string;
  event: string;
}

function extractStateFlow(figmaData: any): {
  states: StateInfo[];
  flows: StateFlow[];
} {
  const states: StateInfo[] = [];
  const flows: StateFlow[] = [];

  // TODO: 여기에 구현
  // 1. CONNECTOR 타입 노드 찾기 (화살표)
  // 2. 연결된 노드(STICKY, SHAPE) 찾기
  // 3. 노드의 색상, 텍스트 추출
  // 4. 전환 규칙 구성

  // 예시 구현 (간단 버전):
  // const connectors = figmaData.nodes.filter(n => n.type === 'CONNECTOR');
  // for (const conn of connectors) {
  //   flows.push({
  //     from: conn.startNodeId,
  //     to: conn.endNodeId,
  //     event: conn.label || 'transition',
  //   });
  // }

  return { states, flows };
}
```

### 3. extractStateUI() - 상태별 UI 추출

**입력:** Figma 노드들 + 상태 정보
**출력:** 각 상태별 UI 요소

```typescript
interface StateUI {
  state: string;
  visible: string[];
  disabled: string[];
  actions: string[];
}

function extractStateUI(figmaData: any, states: StateInfo[]): StateUI[] {
  const stateUIs: StateUI[] = [];

  // TODO: 여기에 구현
  // 1. 각 상태 이름으로 관련 텍스트 찾기
  // 2. "표시", "활성화", "버튼" 키워드 찾기
  // 3. UI 요소 리스트 구성

  // 예시 구현 (간단 버전):
  // for (const state of states) {
  //   stateUIs.push({
  //     state: state.name,
  //     visible: [], // TODO: 텍스트 파싱
  //     disabled: [],
  //     actions: [],
  //   });
  // }

  return stateUIs;
}
```

## 🚀 빠른 시작

### Step 1: 가장 간단한 구현으로 시작

먼저 더미 데이터로 마크다운만 생성되는지 테스트:

```typescript
// 간단한 테스트 구현
function extractRequirements(figmaData: any): string[] {
  return ['지원자 목록 조회', '지원자 상태 변경', '필터링 기능'];
}

function extractStateFlow(figmaData: any) {
  return {
    states: [
      { name: 'pending', label: '대기', color: 'gray' },
      { name: 'approved', label: '승인', color: 'green' },
    ],
    flows: [{ from: 'pending', to: 'approved', event: '승인' }],
  };
}

function extractStateUI(figmaData: any, states: any[]) {
  return [
    {
      state: 'pending',
      visible: ['상태 배지: 회색'],
      actions: ['승인 버튼'],
      disabled: [],
    },
  ];
}
```

### Step 2: 실제 Figma 데이터로 테스트

```bash
/figma-to-markdown https://figma.com/board/your-file
```

Figma 데이터 구조 확인 후 파싱 로직 개선

### Step 3: 점진적으로 개선

1. 요구사항 추출 정확도 개선
2. 상태 플로우 자동 감지 개선
3. 상태별 UI 매핑 정확도 개선

## 📖 Figma 데이터 구조 예시

```json
{
  "nodes": [
    {
      "id": "1:2",
      "type": "TEXT",
      "name": "요구사항",
      "characters": "- [ ] 지원자 목록 조회\n- [x] 지원자 상태 변경"
    },
    {
      "id": "1:3",
      "type": "STICKY",
      "name": "대기",
      "characters": "대기\n(pending)",
      "fills": [{ "color": { "r": 0.5, "g": 0.5, "b": 0.5 } }]
    },
    {
      "id": "1:4",
      "type": "CONNECTOR",
      "startNodeId": "1:3",
      "endNodeId": "1:5",
      "label": "승인"
    }
  ]
}
```

## 💡 구현 팁

### Tip 1: 콘솔로 데이터 확인

```typescript
function extractRequirements(figmaData: any): string[] {
  console.log('Figma Data:', JSON.stringify(figmaData, null, 2));
  // 실제 데이터 구조 확인 후 파싱 로직 작성
  return [];
}
```

### Tip 2: 점진적으로 구현

```typescript
// 1단계: 모든 텍스트 수집
const allTexts = figmaData.nodes.filter(n => n.type === 'TEXT').map(n => n.characters);

// 2단계: 키워드 필터링
const requirements = allTexts.filter(text => text.includes('요구사항')).flatMap(text => text.split('\n'));

// 3단계: 체크박스 패턴만 추출
return requirements.filter(line => line.match(/^[\s-*]*\[(x| )\]/));
```

### Tip 3: 기본값 제공

```typescript
function extractStateFlow(figmaData: any) {
  try {
    // 파싱 시도
    const flows = parseFlows(figmaData);
    return flows;
  } catch (error) {
    // 파싱 실패 시 기본 구조 반환
    console.warn('상태 플로우 파싱 실패, 기본값 사용');
    return {
      states: [],
      flows: [],
    };
  }
}
```

## ✅ 완료 체크리스트

- [ ] `extractRequirements()` 구현
- [ ] `extractStateFlow()` 구현
- [ ] `extractStateUI()` 구현
- [ ] 더미 데이터로 테스트
- [ ] 실제 Figma URL로 테스트
- [ ] 마크다운 파일 생성 확인
- [ ] 내용 검토 및 수정

## 🎉 다음 단계

구현 완료 후:

1. 실제 프로젝트 기획서로 테스트
2. 생성된 마크다운 검토
3. 팀과 공유
4. 피드백 반영
