// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:@next/next/recommended',
    'plugin:react/jsx-runtime'
  ],
  rules: {
    'no-console': 'warn',
    '@next/next/no-img-element': 'off'
  }
};
