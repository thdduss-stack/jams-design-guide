#!/usr/bin/env node

/**
 * OpenAPI 스키마에서 타입을 생성하고 workspace fetch 파일들을 자동 생성하는 스크립트
 *
 * 사용법:
 * node .claude/scripts/generate-workspace-fetch.mjs [--config <config-file>] [--select-api <api-name>]
 * 또는
 * node .claude/scripts/generate-workspace-fetch.mjs <openapi-url> [options]
 *
 * Config 파일 형식 (fetch.config.json):
 * [
 *   {
 *     "url": "https://api.example.com/openapi.json",
 *     "output": "./output/general/types",
 *     "apiName": "general-api",
 *     "baseUrlEnv": "GENERAL_API_URL",
 *     "includePaths": [],
 *     "excludePaths": []
 *   }
 * ]
 *
 * 옵션 (명령줄 인자):
 * - --output, -o: 타입 출력 디렉토리 (기본값: ./src/fetch/workspace/types)
 * - --api-name: API 이름 (기본값: workspace-api)
 * - --base-url-env: Base URL 환경변수 이름 (기본값: WORKSPACE_AUTH_API_URL)
 * - --include-path, -i: 포함할 API 경로 (여러 개 가능)
 * - --exclude-path, -e: 제외할 API 경로 (여러 개 가능)
 * - --config: Config 파일 경로 (기본값: ./generate-workspace-fetch.config.json)
 * - --select-api: Config 파일에서 특정 apiName만 선택하여 실행 (여러 개 가능, 쉼표로 구분)
 * - --interactive, -i: 대화형으로 apiName 선택 (TTY 환경에서 자동 활성화)
 */
import { loadConfig, parseArgs } from './lib/generate-workspace-fetch/config.mjs';
import { processConfig } from './lib/generate-workspace-fetch/generators.mjs';
import { selectApiNames, selectFileGeneration } from './lib/generate-workspace-fetch/interactive.mjs';
import { applyLintingAndFormatting } from './lib/generate-workspace-fetch/utils.mjs';

/**
 * Main entry point
 * Orchestrates the workflow for generating workspace fetch files
 */
async function main() {
  const args = process.argv.slice(2);
  let configPath = null;
  let selectedApiNames = null;
  let interactive = false;

  // --config 옵션 확인
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--config' && args[i + 1]) {
      configPath = args[i + 1];
    }
    if (args[i] === '--select-api' && args[i + 1]) {
      selectedApiNames = args[i + 1].split(',').map(name => name.trim());
    }
    if (args[i] === '--interactive' || args[i] === '-i') {
      interactive = true;
    }
  }

  // Config 파일 로드 시도
  const configs = loadConfig(configPath);
  const allGeneratedFiles = [];

  if (configs && configs.length > 0) {
    // 선택된 apiName 필터링
    let filteredConfigs = configs;

    // --select-api 옵션이 없고 (--interactive 옵션이 있거나 TTY 환경)이면 대화형 선택
    if (!selectedApiNames && (interactive || (process.stdin.isTTY && configs.length > 1))) {
      try {
        selectedApiNames = await selectApiNames(configs);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ 선택 중 오류 발생:', error.message);
        process.exit(1);
      }
    }

    // 파일 생성 옵션 선택 (한번만)
    let fileGenerationOptions = { generateClient: true, generateServer: true }; // 기본값
    if (interactive || process.stdin.isTTY) {
      try {
        fileGenerationOptions = await selectFileGeneration();
        // eslint-disable-next-line no-console
        console.log('\n📋 선택된 파일 생성 옵션:');
        // eslint-disable-next-line no-console
        console.log(`  - client.ts: ${fileGenerationOptions.generateClient ? '✓ 생성' : '✗ 생성 안함'}`);
        // eslint-disable-next-line no-console
        console.log(`  - server.ts: ${fileGenerationOptions.generateServer ? '✓ 생성' : '✗ 생성 안함'}\n`);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ 파일 생성 옵션 선택 중 오류 발생:', error.message);
        process.exit(1);
      }
    }

    if (selectedApiNames && selectedApiNames.length > 0) {
      filteredConfigs = configs.filter(config => {
        const apiName = config.apiName || 'workspace-api';
        return selectedApiNames.includes(apiName);
      });

      if (filteredConfigs.length === 0) {
        // eslint-disable-next-line no-console
        console.error(`❌ 선택한 apiName(\${selectedApiNames.join(', ')})에 해당하는 설정을 찾을 수 없습니다.`);
        // eslint-disable-next-line no-console
        console.log('\\n사용 가능한 apiName 목록:');
        configs.forEach(config => {
          // eslint-disable-next-line no-console
          console.log(`  - \${config.apiName || 'workspace-api'}`);
        });
        process.exit(1);
      }

      // eslint-disable-next-line no-console
      console.log(`\\n📋 선택된 apiName: \${selectedApiNames.join(', ')}`);
      // eslint-disable-next-line no-console
      console.log(`📋 \${filteredConfigs.length}개의 설정을 처리합니다.\\n`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`📋 Config 파일에서 \${configs.length}개의 설정을 발견했습니다.\\n`);
    }

    for (let index = 0; index < filteredConfigs.length; index++) {
      const config = filteredConfigs[index];
      // eslint-disable-next-line no-console
      console.log(`\\n\${'='.repeat(60)}`);
      // eslint-disable-next-line no-console
      console.log(
        `처리 중: 설정 \${index + 1}/\${filteredConfigs.length} (apiName: \${config.apiName || 'workspace-api'})`,
      );
      // eslint-disable-next-line no-console
      console.log(`\${'='.repeat(60)}`);

      // 필수 필드 검증
      if (!config.url) {
        // eslint-disable-next-line no-console
        console.error(`❌ 설정 \${index + 1}에 'url'이 없습니다.`);
        continue;
      }

      const options = {
        url: config.url,
        dataLayer: config.dataLayer || config.output || './src/fetch/workspace/types',
        presentationLayer: config.presentationLayer || config.output || './src/fetch/workspace/types',
        apiName: config.apiName || 'workspace-api',
        baseUrlEnv: config.baseUrlEnv || 'DISPLAY_API_URL_BIZCENTER',
        clientProxyPath: config.clientProxyPath || '/bizcenter/api/display',
        includePaths: config.includePaths || [],
        excludePaths: config.excludePaths || [],
        generateClient: fileGenerationOptions.generateClient,
        generateServer: fileGenerationOptions.generateServer,
      };

      const files = await processConfig(options);
      if (files && files.length > 0) {
        allGeneratedFiles.push(...files);
      }
    }

    // eslint-disable-next-line no-console
    console.log(`\\n' + '='.repeat(60)`);
    // eslint-disable-next-line no-console
    console.log('✅ 모든 설정 처리 완료!');
    // eslint-disable-next-line no-console
    console.log('='.repeat(60));
  } else {
    // 명령줄 인자 사용
    const options = parseArgs();
    // 명령줄에서 실행할 때는 기본적으로 모두 생성
    options.generateClient = true;
    options.generateServer = true;
    const files = await processConfig(options);
    if (files && files.length > 0) {
      allGeneratedFiles.push(...files);
    }
  }

  // 모든 파일 생성 후 ESLint 및 Prettier 적용
  if (allGeneratedFiles.length > 0) {
    // 중복 제거
    const uniqueFiles = [...new Set(allGeneratedFiles)];
    applyLintingAndFormatting(uniqueFiles);
  }

  // eslint-disable-next-line no-console
  console.log('\\n⚠️  다음 작업을 수행해주세요:');
  // eslint-disable-next-line no-console
  console.log('  1. QUERY_KEY를 @shared/fetch/query-keys에 추가');
  // eslint-disable-next-line no-console
  console.log('  2. ENV 환경변수 추가');
  // eslint-disable-next-line no-console
  console.log(`  3. tsconfig.json에 @clientEnv, @serverEnv 추가(자동 생성되지 않음) 
"@clientEnv": ["path/client-env.ts"]
"@serverEnv": ["path/server-env.ts"]`);
  // eslint-disable-next-line no-console
  console.log('  4. 생성된 코드 검토 및 수정');
}

// 메인 함수 실행
main();
