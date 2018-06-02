module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  globals: {
    document: false,
    window: false
  },
  plugins: ['react'],
  extends: 'airbnb',
  rules: {
    semi: [2, 'never'],
    'comma-dangle': 'off',
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'jsx-a11y/anchor-is-valid': 0
  }
};
