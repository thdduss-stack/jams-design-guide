/**
 * @fileoverview Interactive terminal UI for API selection
 * @module lib/interactive
 */

/**
 * Display interactive multi-select UI for file generation options
 *
 * Keyboard controls:
 * - ↑↓: Move cursor up/down
 * - Space: Toggle selection
 * - Enter: Confirm selection
 * - Ctrl+C/Ctrl+D: Cancel and exit
 *
 * @returns {Promise<{generateClient: boolean, generateServer: boolean}>} Promise resolving to file generation options
 * @throws {Error} When not running in TTY environment
 *
 * @example
 * const options = await selectFileGeneration();
 * // User selects both
 * // Returns: { generateClient: true, generateServer: true }
 */
export async function selectFileGeneration() {
  return new Promise((resolve, reject) => {
    /** @type {{name: string, value: 'client' | 'server'}[]} */
    const options = [
      { name: 'client.ts (React Query Hooks)', value: 'client' },
      { name: 'server.ts (Server-side Prefetch)', value: 'server' },
    ];

    let selectedIndex = 0;
    const selectedIndices = new Set(); // 기본적으로 선택 안함
    let buffer = '';

    /**
     * Render the selection UI to stdout
     * @private
     */
    const render = () => {
      // 커서를 맨 위로 이동하고 화면 지우기
      process.stdout.write('\x1b[2J\x1b[H');
      process.stdout.write('\n📋 생성할 파일을 선택하세요 (↑↓ 화살표로 이동, Space로 선택, Enter로 확인):\n\n');

      options.forEach((option, index) => {
        const isSelected = selectedIndices.has(index);
        const isCurrent = index === selectedIndex;
        const checkbox = isSelected ? '[✓]' : '[ ]';
        const pointer = isCurrent ? '▶' : ' ';
        const highlight = isCurrent ? '\x1b[1m\x1b[36m' : '';
        const reset = '\x1b[0m';

        process.stdout.write(`${pointer} ${checkbox} ${highlight}${option.name}${reset}\n`);
      });

      process.stdout.write('\n선택된 항목: ');
      const selected = Array.from(selectedIndices)
        .map(idx => options[idx].name)
        .join(', ');
      process.stdout.write(selected || '없음');
      process.stdout.write('\n');
    };

    // 초기 렌더링
    render();

    // 터미널을 raw 모드로 설정
    if (!process.stdin.isTTY) {
      reject(new Error('TTY 환경이 아닙니다.'));
      return;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    /**
     * Handle keyboard input data
     * @private
     * @param {Buffer | string} data - Input data from stdin
     */
    const onData = data => {
      const str = data.toString();

      // 버퍼에 추가
      buffer += str;

      // 화살표 키 시퀀스 확인 (ESC[A 또는 ESC[B) - 완전한 시퀀스가 있는지 확인
      const arrowUpIndex = buffer.indexOf('\u001b[A');
      const arrowDownIndex = buffer.indexOf('\u001b[B');

      if (arrowUpIndex !== -1) {
        // 위 화살표 발견
        buffer = '';
        selectedIndex = Math.max(0, selectedIndex - 1);
        render();
        return;
      }

      if (arrowDownIndex !== -1) {
        // 아래 화살표 발견
        buffer = '';
        selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
        render();
        return;
      }

      // ESC[로 시작하는데 아직 완성되지 않은 경우 (화살표 키 입력 중)
      if (buffer.includes('\u001b[')) {
        // 최대 3바이트까지만 기다림
        if (buffer.length <= 3) {
          return;
        }
        // 3바이트를 넘었는데 화살표 키가 아니면 다른 제어 시퀀스
        buffer = '';
        return;
      }

      // ESC만 있는 경우 (화살표 키의 시작일 수 있음)
      if (buffer === '\u001b') {
        // 짧은 시간만 기다림
        return;
      }

      // 일반 문자 처리
      const char = buffer[buffer.length - 1];

      // ESC로 시작하지 않으면 버퍼 리셋
      if (!buffer.startsWith('\u001b')) {
        buffer = '';
      }

      // Ctrl+C 또는 Ctrl+D로 종료
      if (char === '\u0003' || char === '\u0004') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\x1b[2J\x1b[H');
        // eslint-disable-next-line no-console
        console.log('❌ 선택이 취소되었습니다.');
        process.exit(0);
      }

      // Enter 키
      if (char === '\r' || char === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\x1b[2J\x1b[H');

        const result = {
          generateClient: selectedIndices.has(0),
          generateServer: selectedIndices.has(1),
        };

        resolve(result);
        return;
      }

      // Space 키로 선택/해제
      if (char === ' ') {
        if (selectedIndices.has(selectedIndex)) {
          selectedIndices.delete(selectedIndex);
        } else {
          selectedIndices.add(selectedIndex);
        }
        render();
        return;
      }

      buffer = '';
    };

    process.stdin.on('data', onData);
  });
}

/**
 * Display interactive multi-select UI for API selection
 *
 * Keyboard controls:
 * - ↑↓: Move cursor up/down
 * - Space: Toggle selection
 * - Enter: Confirm selection
 * - Ctrl+C/Ctrl+D: Cancel and exit
 *
 * @param {import('../../types').ApiConfig[]} configs - Array of API configurations
 * @returns {Promise<string[]>} Promise resolving to array of selected API names
 * @throws {Error} When not running in TTY environment
 *
 * @example
 * const configs = [
 *   { apiName: 'auth-api', url: 'https://...' },
 *   { apiName: 'user-api', url: 'https://...' }
 * ];
 * const selected = await selectApiNames(configs);
 * // User selects 'auth-api'
 * // Returns: ['auth-api']
 *
 * @example
 * // User selects "모두 선택" option
 * const selected = await selectApiNames(configs);
 * // Returns: ['auth-api', 'user-api']
 */
export async function selectApiNames(configs) {
  return new Promise((resolve, reject) => {
    /** @type {import('../../types').SelectOption[]} */
    const options = [
      { name: '모두 선택', value: '__ALL__' },
      ...configs.map(config => ({
        name: config.apiName || 'workspace-api',
        url: config.url,
        value: config.apiName || 'workspace-api',
      })),
    ];

    let selectedIndex = 0;
    const selectedIndices = new Set();
    let buffer = '';

    /**
     * Render the selection UI to stdout
     * @private
     */
    const render = () => {
      // 커서를 맨 위로 이동하고 화면 지우기
      process.stdout.write('\x1b[2J\x1b[H');
      process.stdout.write('\n📋 사용 가능한 API 목록 (↑↓ 화살표로 이동, Space로 선택, Enter로 확인):\n\n');

      options.forEach((option, index) => {
        const isSelected = selectedIndices.has(index);
        const isCurrent = index === selectedIndex;
        const checkbox = isSelected ? '[✓]' : '[ ]';
        const pointer = isCurrent ? '▶' : ' ';
        const highlight = isCurrent ? '\x1b[1m\x1b[36m' : '';
        const reset = '\x1b[0m';

        if (option.value === '__ALL__') {
          process.stdout.write(`${pointer} ${checkbox} ${highlight}${option.name}${reset}\n`);
        } else {
          process.stdout.write(`${pointer} ${checkbox} ${highlight}${option.name}${reset} (${option.url})\n`);
        }
      });

      process.stdout.write('\n선택된 항목: ');
      const selected = Array.from(selectedIndices)
        .map(idx => options[idx].name)
        .join(', ');
      process.stdout.write(selected || '없음');
      process.stdout.write('\n');
    };

    // 초기 렌더링
    render();

    // 터미널을 raw 모드로 설정
    if (!process.stdin.isTTY) {
      reject(new Error('TTY 환경이 아닙니다.'));
      return;
    }

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    /**
     * Handle keyboard input data
     * @private
     * @param {Buffer | string} data - Input data from stdin
     */
    const onData = data => {
      const str = data.toString();

      // 버퍼에 추가
      buffer += str;

      // 화살표 키 시퀀스 확인 (ESC[A 또는 ESC[B) - 완전한 시퀀스가 있는지 확인
      const arrowUpIndex = buffer.indexOf('\u001b[A');
      const arrowDownIndex = buffer.indexOf('\u001b[B');

      if (arrowUpIndex !== -1) {
        // 위 화살표 발견
        buffer = '';
        selectedIndex = Math.max(0, selectedIndex - 1);
        render();
        return;
      }

      if (arrowDownIndex !== -1) {
        // 아래 화살표 발견
        buffer = '';
        selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
        render();
        return;
      }

      // ESC[로 시작하는데 아직 완성되지 않은 경우 (화살표 키 입력 중)
      if (buffer.includes('\u001b[')) {
        // 최대 3바이트까지만 기다림
        if (buffer.length <= 3) {
          return;
        }
        // 3바이트를 넘었는데 화살표 키가 아니면 다른 제어 시퀀스
        buffer = '';
        return;
      }

      // ESC만 있는 경우 (화살표 키의 시작일 수 있음)
      if (buffer === '\u001b') {
        // 짧은 시간만 기다림
        return;
      }

      // 일반 문자 처리
      const char = buffer[buffer.length - 1];

      // ESC로 시작하지 않으면 버퍼 리셋
      if (!buffer.startsWith('\u001b')) {
        buffer = '';
      }

      // Ctrl+C 또는 Ctrl+D로 종료
      if (char === '\u0003' || char === '\u0004') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\x1b[2J\x1b[H');
        // eslint-disable-next-line no-console
        console.log('❌ 선택이 취소되었습니다.');
        process.exit(0);
      }

      // Enter 키
      if (char === '\r' || char === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write('\x1b[2J\x1b[H');

        if (selectedIndices.size === 0) {
          // eslint-disable-next-line no-console
          console.log('❌ 선택된 항목이 없습니다.');
          process.exit(0);
        }

        const selectedApiNames = [];
        for (const idx of selectedIndices) {
          if (options[idx].value === '__ALL__') {
            // 모두 선택
            resolve(configs.map(config => config.apiName || 'workspace-api'));
            return;
          }
          selectedApiNames.push(options[idx].value);
        }

        resolve(selectedApiNames);
        return;
      }

      // Space 키로 선택/해제
      if (char === ' ') {
        if (selectedIndices.has(selectedIndex)) {
          selectedIndices.delete(selectedIndex);
        } else {
          selectedIndices.add(selectedIndex);
        }
        render();
        return;
      }

      buffer = '';
    };

    process.stdin.on('data', onData);
  });
}
