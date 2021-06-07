module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parser: 'vue-eslint-parser',
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  plugins: ['vue'],
  rules: {
    // 解决let被强转为const问题
    "prefer-const": 0,
    'no-console': 'off',
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false,
      },
    ],
    'no-irregular-whitespace': 'off', //空格检查
    // indent: ['error', 2, { SwitchCase: 1 }], // 缩进检查
    'prettier/prettier': 'off', // 这一句是为了解决一个bug
    'no-unused-vars': 'off',
    'no-useless-escape': 'off',
    'no-compare-neg-zero': 'off',
    'no-redeclare': 'off',
    'no-prototype-builtins': 'off',
    'no-inner-declarations': 'off',
    'no-empty': 'off',
    "vue/no-unused-components": "off",
    "no-mixed-spaces-and-tabs": "off"
  },
}
