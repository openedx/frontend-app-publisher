const { createConfig } = require('@edx/frontend-build');

const config = createConfig('jest', {
  setupFiles: [
    '<rootDir>/src/setupTest.js',
  ],
});

config.transformIgnorePatterns = [
  '/node_modules/(?!(tinymce-language-selector|@edx))/',
];

module.exports = config;
