import type { ParsedData } from './parser';
import { generateFilePath, generateMarkdown } from './generator';
import { extractFeatureName, extractRequirements, extractStateFlow, extractStateUI } from './parser';

/**
 * Figma to Markdown Skill
 *
 * Figma 기획서를 읽어서 UI 로직 마크다운 문서로 자동 변환합니다.
 *
 * 사용법:
 *   /figma-to-markdown <figma-url>
 *
 * 예시:
 *   /figma-to-markdown https://figma.com/design/uy4pUNV15IRjwQ7SL3FaO8/Spec?node-id=781-26433
 */

interface SkillInput {
  figmaUrl: string;
}

interface SkillOutput {
  success: boolean;
  filePath?: string;
  lineCount?: number;
  todoCount?: number;
  error?: string;
}

/**
 * Figma URL에서 fileKey와 nodeId 추출
 */
function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // /design/:fileKey/:fileName 또는 /board/:fileKey/:fileName
    const fileKey = pathParts[2];

    // node-id 파라미터 추출 (예: 781-26433 -> 781:26433)
    const nodeIdParam = urlObj.searchParams.get('node-id');
    if (!nodeIdParam) {
      throw new Error('node-id 파라미터가 없습니다');
    }

    const nodeId = nodeIdParam.replace('-', ':');

    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

/**
 * TODO 개수 카운트
 */
function countTodos(markdown: string): number {
  const matches = markdown.match(/TODO:/g);
  return matches ? matches.length : 0;
}

/**
 * 메인 실행 함수
 */
export async function run(input: SkillInput): Promise<SkillOutput> {
  try {
    // 1. Figma URL 파싱
    const parsed = parseFigmaUrl(input.figmaUrl);
    if (!parsed) {
      return {
        success: false,
        error: 'Figma URL 형식이 올바르지 않습니다. node-id 파라미터를 포함해야 합니다.',
      };
    }

    // 2. Figma 데이터 가져오기
    // Figma MCP를 통해 데이터 가져오기
    // 실제 구현 시 mcp__figma__get_design_context 또는 mcp__figma__get_figjam 사용
    const figmaData = await fetchFigmaData(parsed.fileKey, parsed.nodeId);

    // 3. 데이터 파싱
    const featureName = extractFeatureName(figmaData);
    const requirements = extractRequirements(figmaData);
    const { flows, states } = extractStateFlow(figmaData);
    const stateUIs = extractStateUI(figmaData, states);

    // 4. 마크다운 생성
    const parsedData: ParsedData = {
      featureName,
      flows,
      requirements,
      states,
      stateUIs,
    };

    const markdown = generateMarkdown(parsedData);
    const lineCount = markdown.split('\n').length;
    const todoCount = countTodos(markdown);

    // 5. 파일 저장
    const filePath = generateFilePath(featureName);

    // Write tool을 사용해서 파일 저장
    // 실제 구현 시 Claude Code의 Write tool 사용
    await saveMarkdownFile(filePath, markdown);

    return {
      filePath,
      lineCount,
      success: true,
      todoCount,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '알 수 없는 에러',
      success: false,
    };
  }
}

/**
 * Figma 데이터 가져오기
 * TODO: 실제 Figma MCP 호출로 교체 필요
 */
// eslint-disable-next-line unused-imports/no-unused-vars
async function fetchFigmaData(_fileKey: string, _nodeId: string): Promise<unknown> {
  // 실제 구현에서는 mcp__figma__get_design_context 사용
  // const result = await mcp__figma__get_design_context({
  //   fileKey,
  //   nodeId,
  //   clientLanguages: 'typescript',
  //   clientFrameworks: 'react',
  // });

  // 현재는 placeholder
  throw new Error('fetchFigmaData 구현 필요: mcp__figma__get_design_context 호출');
}

/**
 * 마크다운 파일 저장
 * TODO: 실제 Write tool 호출로 교체 필요
 */
// eslint-disable-next-line unused-imports/no-unused-vars
async function saveMarkdownFile(_filePath: string, _content: string): Promise<void> {
  // 실제 구현에서는 Write tool 사용
  // await Write({
  //   file_path: filePath,
  //   content,
  // });

  // 현재는 placeholder
  throw new Error('saveMarkdownFile 구현 필요: Write tool 호출');
}

// 스킬 엔트리 포인트
export default run;
