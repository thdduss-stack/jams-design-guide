/**
 * @fileoverview Configuration loading and validation for workspace fetch generator
 * @module lib/config
 * @requires fs
 * @requires path
 * @requires url
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/**
 * Get the project root directory
 *
 * @returns {string} Absolute path to project root
 *
 * @example
 * const root = getProjectRoot();
 * // Returns: /Users/moon/workspace/Test/api-skills
 */
export function getProjectRoot() {
  return process.cwd();
}

/**
 * Load and validate configuration file
 *
 * @param {string} [configPath] - Path to config file relative to project root.
 *                                 Defaults to 'generate-workspace-fetch.config.json'
 * @returns {import('../../types').ApiConfig[] | null} Array of API configurations or null if file doesn't exist
 * @throws {Error} When config file is invalid JSON or not an array
 *
 * @example
 * const configs = loadConfig('./my-config.json');
 * if (configs) {
 *   configs.forEach(config => console.log(config.apiName));
 * }
 *
 * @example
 * // Use default config file
 * const configs = loadConfig();
 */
export function loadConfig(configPath) {
  const projectRoot = getProjectRoot();
  const configFile = join(projectRoot, configPath || 'generate-workspace-fetch.config.json');

  if (!existsSync(configFile)) {
    return null;
  }

  try {
    const content = readFileSync(configFile, 'utf-8');
    const config = JSON.parse(content);

    if (!Array.isArray(config)) {
      console.error('❌ Config 파일은 배열 형식이어야 합니다.');
      process.exit(1);
    }

    return config;
  } catch (error) {
    console.error(`❌ Config 파일을 읽는 중 오류 발생: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Parse command-line arguments for direct URL mode
 *
 * Supported arguments:
 * - URL as first positional argument (http:// or https://)
 * - --output, -o: Output directory path
 * - --api-name: API name for file naming
 * - --base-url-env: Environment variable name for base URL
 * - --include-path, -i: API paths to include (can be specified multiple times)
 * - --exclude-path, -e: API paths to exclude (can be specified multiple times)
 *
 * @returns {import('../../types').ParsedOptions} Parsed command-line options
 * @throws {Error} Exits process if URL is not provided
 *
 * @example
 * // Command: node script.mjs https://api.example.com/openapi.json --api-name my-api
 * const options = parseArgs();
 * // Returns: { url: 'https://...', apiName: 'my-api', ... }
 */
export function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: null,
    output: './src/fetch/workspace/types',
    apiName: 'workspace-api',
    baseUrlEnv: 'WORKSPACE_AUTH_API_URL',
    includePaths: [],
    excludePaths: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if (arg.startsWith('http://') || arg.startsWith('https://')) {
      options.url = arg;
    } else if (arg === '--output' || arg === '-o') {
      options.output = nextArg;
      i++;
    } else if (arg === '--api-name') {
      options.apiName = nextArg;
      i++;
    } else if (arg === '--base-url-env') {
      options.baseUrlEnv = nextArg;
      i++;
    } else if (arg === '--include-path' || arg === '-i') {
      options.includePaths.push(nextArg);
      i++;
    } else if (arg === '--exclude-path' || arg === '-e') {
      options.excludePaths.push(nextArg);
      i++;
    }
  }

  if (!options.url) {
    console.error('❌ OpenAPI 문서 URL이 필요합니다.');
    console.error('사용법: node generate-workspace-fetch.mjs <openapi-url> [options]');
    console.error('또는 config 파일을 사용하세요: node generate-workspace-fetch.mjs --config <config-file>');
    process.exit(1);
  }

  return options;
}
