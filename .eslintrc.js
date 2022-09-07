// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
  overrides: [{
    files: ['*.test.jsx'], rules: { 'react/jsx-no-constructed-context-values': 'off' },
  }],
});
