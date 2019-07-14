module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true,
    jquery: true,
    es6: true
  },
  rules: {
    'no-console': [
      'error',
      {
        allow: ['log', 'warn', 'error']
      }
    ],
    quotes: ['error', 'single'],
    'no-var': 'error'
  }
};
