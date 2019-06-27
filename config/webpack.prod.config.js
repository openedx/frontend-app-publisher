// This is the prod Webpack config. All settings here should prefer smaller,
// optimized bundles at the expense of a longer build time.
const Merge = require('webpack-merge');
const commonConfig = require('./webpack.common.config.js');
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = Merge.smart(commonConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../dist'),
  },
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
      },
      // Webpack, by default, includes all CSS in the javascript bundles. Unfortunately, that means:
      // a) The CSS won't be cached by browsers separately (a javascript change will force CSS
      // re-download).  b) Since CSS is applied asyncronously, it causes an ugly
      // flash-of-unstyled-content.
      //
      // To avoid these problems, we extract the CSS from the bundles into separate CSS files that
      // can be included as <link> tags in the HTML <head> manually.
      //
      // We will not do this in development because it prevents hot-reloading from working and it
      // increases build time.
      {
        test: /(.scss|.css)$/,
        use: ExtractTextPlugin.extract({
          // creates style nodes from JS strings, only used if extracting fails
          fallback: 'style-loader',
          use: [
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
        }),
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
  // New in Webpack 4. Replaces CommonChunksPlugin. Extract common modules among all chunks to one
  // common chunk and extract the Webpack runtime to a single runtime chunk.
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  // Specify additional processing or side-effects done on the Webpack output bundles as a whole.
  plugins: [
    // Writes the extracted CSS from each entry to a file in the output directory.
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true,
    }),
    // Generates an HTML file in the output directory.
    new HtmlWebpackPlugin({
      inject: true, // Appends script tags linking to the webpack bundles at the end of the body
      template: path.resolve(__dirname, '../public/index.html'),
    }),
    new webpack.EnvironmentPlugin({
      // default values of undefined to force definition in the environment at build time
      NODE_ENV: 'production',
      BASE_URL: null,
      LMS_BASE_URL: null,
      STUDIO_BASE_URL: null,
      DISCOVERY_API_BASE_URL: null,
      LOGIN_URL: null,
      LOGOUT_URL: null,
      CSRF_TOKEN_API_PATH: null,
      REFRESH_ACCESS_TOKEN_ENDPOINT: null,
      ACCESS_TOKEN_COOKIE_NAME: null,
      USER_INFO_COOKIE_NAME: null,
      SITE_NAME: null,
      MARKETING_SITE_BASE_URL: null,
      SUPPORT_URL: null,
      CONTACT_URL: null,
      OPEN_SOURCE_URL: null,
      TERMS_OF_SERVICE_URL: null,
      PRIVACY_POLICY_URL: null,
      FACEBOOK_URL: null,
      TWITTER_URL: null,
      YOU_TUBE_URL: null,
      LINKED_IN_URL: null,
      REDDIT_URL: null,
      APPLE_APP_STORE_URL: null,
      GOOGLE_PLAY_URL: null,
      ENTERPRISE_MARKETING_URL: null,
      ENTERPRISE_MARKETING_UTM_SOURCE: null,
      ENTERPRISE_MARKETING_UTM_CAMPAIGN: null,
      ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM: null,
      ORG_WHITELIST: [],
    }),
  ],
});
