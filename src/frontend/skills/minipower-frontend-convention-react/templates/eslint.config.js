// Convention — đặt ở gốc repo frontend. CI: `npm run lint` + `npm run typecheck`.
// devDependencies: eslint @eslint/js typescript-eslint eslint-plugin-react-hooks globals
// Giữ typescript ~6.0 — typescript-eslint chưa hỗ trợ TypeScript 7.
import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import architecture from './eslint.architecture.js'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    rules: {
      // Hai rule hooks kinh điển. KHÔNG dùng preset recommended-latest (rule React Compiler:
      // set-state-in-effect, refs…) — nó đánh đỏ mẫu nạp dữ liệu của kit `useEffect(() => { void reload() }, [reload])`.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
    },
  },
  // Luật kiến trúc R1–R7 — minipower-frontend-architecture-react
  ...architecture,
])
