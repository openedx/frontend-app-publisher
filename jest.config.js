const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('jest', {
  setupFiles: [
    '<rootDir>/src/setupTest.js',
  ],
});

module.exports = config;
