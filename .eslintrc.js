/*
 * @Author: czy0729
 * @Date: 2019-03-13 05:15:36
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-05-28 05:49:01
 */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // babel-eslint | @typescript-eslint/parser
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: ['@react-native-community', 'prettier'],
  ignorePatterns: [
    '/node_modules',
    '/components/@/*',
    '/src/utils/thirdParty/*',
    'babel.config.js',
    'jsconfig.json'
  ],
  globals: {
    global: true,
    rerender: true,
    warn: true,
    log: true,
    JSX: true
  },
  rules: {
    radix: 0, // parseInt允许不填进制
    'no-shadow': 0, // 允许相同变量名
    'max-len': ['error', 200],
    eqeqeq: 0,
    'react/no-did-mount-set-state': 0,
    'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    '@typescript-eslint/no-unused-vars': [2, { ignoreRestSiblings: true }]
  }
}
