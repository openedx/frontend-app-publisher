// This is the dev Webpack config. All settings here should prefer a fast build
// time at the expense of creating larger, unoptimized bundles.
const Merge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const commonConfig = require('./webpack.common.config.js');

module.exports = Merge.smart(commonConfig, {
  mode: 'development',
  entry: [
    // enable react's custom hot dev client so we get errors reported in the browser
    require.resolve('react-dev-utils/webpackHotDevClient'),
    path.resolve(__dirname, '../src/index.jsx'),
  ],
  module: {
    // Specify file-by-file rules to Webpack. Some file-types need a particular kind of loader.
    rules: [
      // The babel-loader transforms newer ES2015+ syntax to older ES5 for older browsers.
      // Babel is configured with the .babelrc file at the root of the project.
      {
        test: /\.(js|jsx)$/,
        include: [
          path.resolve(__dirname, '../src'),
        ],
        loader: 'babel-loader',
        options: {
          // Caches result of loader to the filesystem. Future builds will attempt to read from the
          // cache to avoid needing to run the expensive recompilation process on each run.
          cacheDirectory: true,
        },
      },
      // We are not extracting CSS from the javascript bundles in development because extracting
      // prevents hot-reloading from working, it increases build time, and we don't care about
      // flash-of-unstyled-content issues in development.
      {
        test: /(.scss|.css)$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true,
              includePaths: [
                path.join(__dirname, '../node_modules'),
                path.join(__dirname, '../src'),
              ],
            },
          },
        ],
      },
      // Webpack, by default, uses the url-loader for images and fonts that are required/included by
      // files it processes, which just base64 encodes them and inlines them in the javascript
      // bundles. This makes the javascript bundles ginormous and defeats caching so we will use the
      // file-loader instead to copy the files directly to the output directory.
      {
        test: /\.(woff2?|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|ico)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              optimizationlevel: 7,
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
            },
          },
        ],
      },
    ],
  },
  // Specify additional processing or side-effects done on the Webpack output bundles as a whole.
  plugins: [
    // Generates an HTML file in the output directory.
    new HtmlWebpackPlugin({
      inject: true, // Appends script tags linking to the webpack bundles at the end of the body
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      BASE_URL: 'localhost:18400',
      LMS_BASE_URL: 'http://localhost:18000',
      STUDIO_BASE_URL: 'http://localhost:18010',
      DISCOVERY_API_BASE_URL: 'http://localhost:18381',
      LOGIN_URL: 'http://localhost:18000/login',
      LOGOUT_URL: 'http://localhost:18000/logout',
      CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
      REFRESH_ACCESS_TOKEN_ENDPOINT: 'http://localhost:18000/login_refresh',
      ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
      USER_INFO_COOKIE_NAME: 'edx-user-info',
      SITE_NAME: 'edX',
      MARKETING_SITE_BASE_URL: 'http://localhost:18000',
      SUPPORT_URL: 'http://localhost:18000/support',
      CONTACT_URL: 'http://localhost:18000/contact',
      OPEN_SOURCE_URL: 'http://localhost:18000/openedx',
      TERMS_OF_SERVICE_URL: 'http://localhost:18000/terms-of-service',
      PRIVACY_POLICY_URL: 'http://localhost:18000/privacy-policy',
      FACEBOOK_URL: 'https://www.facebook.com',
      TWITTER_URL: 'https://twitter.com',
      YOU_TUBE_URL: 'https://www.youtube.com',
      LINKED_IN_URL: 'https://www.linkedin.com',
      REDDIT_URL: 'https://www.reddit.com',
      APPLE_APP_STORE_URL: 'https://www.apple.com/ios/app-store/',
      GOOGLE_PLAY_URL: 'https://play.google.com/store',
      ENTERPRISE_MARKETING_URL: 'http://example.com',
      ENTERPRISE_MARKETING_UTM_SOURCE: 'example.com',
      ENTERPRISE_MARKETING_UTM_CAMPAIGN: 'example.com Referral',
      ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM: 'Footer',
      ORG_WHITELIST: '', // CSV string 'edx,edx2'
    }),
    // when the --hot option is not passed in as part of the command
    // the HotModuleReplacementPlugin has to be specified in the Webpack configuration
    // https://webpack.js.org/configuration/dev-server/#devserver-hot
    new webpack.HotModuleReplacementPlugin(),
  ],
  // This configures webpack-dev-server which serves bundles from memory and provides live
  // reloading.
  devServer: {
    host: '0.0.0.0',
    port: 18400,
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
});
