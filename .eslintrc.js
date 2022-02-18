const { createConfig } = require('@edx/frontend-build');

module.exports = createConfig('eslint', {
    parser: "@babel/eslint-parser", // TODO: remove this once babel-eslint is replaced with @babel/eslint-parser in frontend-build
});
