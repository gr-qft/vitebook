module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  ignorePatterns: ['.eslintrc.js', 'packages/**/bin', 'examples/**'],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.eslint.json',
        extraFileExtensions: ['.vue']
      }
    },
    {
      files: ['*.jsx', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.eslint.json'
      }
    }
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'prettier'
  ],
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '(^_)|(^props$)' }
    ],
    // Typescript handles these.
    'no-undef': 'off',
    'import/no-unresolved': 'off'
  },
  settings: {
    'import/resolver': { typescript: {} }
  }
};
