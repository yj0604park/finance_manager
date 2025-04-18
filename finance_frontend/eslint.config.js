import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    // API 자동 생성 파일과 빌드 파일 무시, .eslintignore 내용 포함
    ignores: [
      'dist',
      '**/api/**/*.ts',
      '**/setupTests.ts',
      // .eslintignore 패턴 추가
      'src/api/core/',
      'src/api/models/',
      'src/api/services/',
      'src/api/index.ts',
      'node_modules/',
      'dist-ssr',
      '*.local',
      'build/',
      'coverage/',
      'logs',
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
      'lerna-debug.log*',
      '.vscode/*',
      '!.vscode/extensions.json',
      '.idea',
      '.DS_Store',
      '*.suo',
      '*.ntvs*',
      '*.njsproj',
      '*.sln',
      '*.sw?'
    ]
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'report-unused-disable-directives': 'off',
    },
  },
  {
    files: ['**/__mocks__/**', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
)
