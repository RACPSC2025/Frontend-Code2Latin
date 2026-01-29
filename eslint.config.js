module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 8, sourceType: 'module' },
  ignorePatterns: ['node_modules/*'],
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  plugins: ['react'],
  files: ['**/*.js', '**/*.jsx'],
  settings: {
    react: { version: 'detect' }
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/*/*']
      }
    ],
    'linebreak-style': ['error', 'unix'],
    'react/prop-types': 'off',

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',

    'react/react-in-jsx-scope': 'off',
    'react-hooks/exhaustive-deps': 'off',

    'no-unused-vars': ['error'],
    'no-empty-function': ['error']
  }
};
