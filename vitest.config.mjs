/// <reference types="vitest" />
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['./src/**/*.test.ts', './src/**/**/*.test.ts'],
    exclude: ['**/*.spec.ts', '**/*.test.tsx'],
    // OOM 방지: 워커 수 제한 (힙 부족 시 더 낮춤)
    maxWorkers: 4,
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'json-summary'],
      reportsDirectory: './coverage',
      all: false, // 테스트가 없는 파일은 리포트에서 제외
      skipFull: false, // 100% 커버리지 파일도 표시 (비교를 위해)
      exclude: [
        // 빌드 관련 디렉토리
        '.next/**',
        'public/**',
        'node_modules/**',
        'dist/**',
        'instrumentation-client.ts',
        'instrumentation.server.ts',
        'instrumentation.ts',

        // 설정 및 타입 파일
        'e2e/**',
        'e2e/**/*.ts', // e2e 폴더의 모든 TypeScript 파일 제외
        '.husky/**',
        '**/*.d.ts',
        '**/*.config.*',
        '*.mjs',
        // '*.ts',

        // 테스트에서 제외할 파일
        '**/*.tsx',
        '**/*.css.ts',
        '**/*.spec.ts', // spec.ts 파일 제외
        'e2e/**/*.ts',
        'scripts/**',

        // 타입 정의 파일 제외
        '**/*.types.ts',
        '**/types.ts',
        '**/*types.ts',

        // 기본적으로 모든 ts 파일 제외
        'src/**/*.ts',

        // 테스트 대상이 되는 파일만 포함
        '!src/**/model/**/*.ts',
        '!src/**/model.ts',
        '!src/**/lib/**/*.ts',
        '!src/shared/utils/**/*.ts',
        '!src/shared/ui/**/*.ts',
        '!src/shared/hooks/**/*.ts',
        '!src/shared/libs/**/*.ts',
        '!src/entities/**/ui/**/*.ts',

        // applicant 관련 파일 포함
        '!src/widgets/workspace/applicant/**/hooks/**/*.ts',
        '!src/widgets/workspace/applicant/**/utils/**/*.ts',
        '!src/features/applicants/**/hooks/**/*.ts',
        '!src/features/applicants/**/util/**/*.ts',
        '!src/features/applicants/**/constants.ts',

        // DDP 아키텍처 파일 포함 (모든 레이어)
        '!src/views/**/domain/**/*.ts',
        '!src/views/**/data/**/*.ts',
        '!src/views/**/model/**/*.ts',
        '!src/entities/**/domain/**/*.ts',
        '!src/entities/**/services/**/*.ts',
        '!src/features/**/domain/**/*.ts',
        '!src/widgets/**/domain/**/*.ts',

        // 다시 types 파일들 제외 (negation 후에 다시 제외)
        'src/**/*.types.ts',
        'src/**/types.ts',
        'src/**/*types.ts',

        // constants 파일 제외 (상수 정의만 포함하는 파일)
        'src/**/constants.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
