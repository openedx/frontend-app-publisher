const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('webpack-dev');

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

module.exports = config;
