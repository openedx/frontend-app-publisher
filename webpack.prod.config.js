const { createConfig } = require('@edx/frontend-build');

const config = createConfig('webpack-prod');

config.module.rules[0].exclude = /node_modules\/(?!(query-string|split-on-first|strict-uri-encode|@edx))/;

module.exports = config;
