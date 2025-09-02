module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['vitest-globals'],
  overrides: [
    {
      files: ['*.test.ts'],
      env: { 'vitest-globals/env': true }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {}
};