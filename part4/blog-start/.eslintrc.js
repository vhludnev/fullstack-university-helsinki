// prettier-ignore

module.exports = {
  'env': {
    'node': true,
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': ['eslint:recommended', 'prettier'],
  'overrides': [],
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      0,
      'tab'
    ],
    'no-unused-vars': 'off',
    'linebreak-style': [
      'error',
      'unix'
    ],
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'arrow-spacing': [
      'error', { before: true, after: true }
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': 0
  },
}
