const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('jest', {
  setupFiles: [
    '<rootDir>/src/setupTest.js',
  ],
  "testEnvironmentOptions": { "resources": "usable", "userAgent": "Moz/123" },
});


console.error(config, 'JJ')

module.exports = config;
