module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    'no-console': 'warn',
    'no-debugger': 'error',

    // TypeScript의 any 타입 사용을 금지하지 않음.
    '@typescript-eslint/no-explicit-any': 'off',

    // TypeScript의 사용하지 않는 변수 오류 off
    '@typescript-eslint/no-unused-vars': 'off',

    // no-undef 규칙 비활성화 (TypeScript가 처리)
    'no-undef': 'off',

    // 프로덕션 환경에서는 console 사용에 대해 경고를 표시하고, 그 외 환경에서는 금지하지 않음.
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 프로덕션 환경에서 debugger 사용에 대해 경고를 표시하고, 그 외 환경에서는 금지하지 않음.
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 문단 마지막 항상 세미콜론
    'semi': ['error', 'always'],

    // single quote 사용
    'quotes': ['error', 'single'],

    // Tab은 Space 2칸으로 정의
    'indent': ['error', 2, { 'SwitchCase': 1 }],

    // var 선언 금지 off
    'no-var': 'off',

    // arguments 객체 사용 금지 off
    'prefer-rest-params': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js'],
};