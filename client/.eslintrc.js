module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-plusplus': 'off',
    'default-param-last': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
    'react/prop-types': 'off'
  }
};
