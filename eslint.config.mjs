import { configs, defineConfig } from '@jds/config-eslint';

// ESLint 설정을 내보내기.
export default defineConfig([
  {
    ignores: ['public/assets/pdf.worker.mjs', 'src/shared/types/global.d.ts', 'src/shared/utils/pdf-utils.ts'],
  },
  ...configs.base,
  ...configs.react,
  ...configs.next,
  {
    settings: {
      react: {
        version: '19.0.0',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
      'no-console': 'error',
      'unused-imports/no-unused-vars': 'error',
    },
  },
  {
    files: ['e2e/**/*.spec.ts', 'src/**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
]);
