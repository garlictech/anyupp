// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// const { preprocessTypescript } = require('@nrwl/cypress/plugins/preprocessor');
// const browserify = require('@cypress/browserify-preprocessor');

/* OLD CONFIG ==>

const cucumber = require('cypress-cucumber-preprocessor').default;
const resolve = require('resolve');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Preprocess Typescript file using Nx helper
  // on('file:preprocessor', preprocessTypescript(config));
  const options = {
    // ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', { baseDir: config.projectRoot }),
  };

  on('file:preprocessor', cucumber(options));
};

<== OLD CONFIG */

const webpackPreprocessor = require('@cypress/webpack-preprocessor');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on(
    'file:preprocessor',
    webpackPreprocessor({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
          plugins: [
            new TsconfigPathsPlugin({
              configFile: config.env.tsConfig,
              extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
            }),
          ],
          fallback: {
            path: require.resolve('path-browserify'),
          },
        },
        module: {
          rules: [
            {
              test: /\.([jt])sx?$/,
              loader: 'ts-loader',
              exclude: [/node_modules/],
              options: {
                configFile: config.env.tsConfig,
                // https://github.com/TypeStrong/ts-loader/pull/685
                experimentalWatchApi: true,
                transpileOnly: true,
              },
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: 'cypress-cucumber-preprocessor/loader',
                },
              ],
            },
            {
              test: /\.features$/,
              use: [
                {
                  loader: 'cypress-cucumber-preprocessor/lib/featuresLoader',
                },
              ],
            },
          ],
        },
        plugins: [
          new ForkTsCheckerWebpackPlugin({
            typescript: {
              enabled: true,
              configFile: config.env.tsConfig,
            },
          }),
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
        ],
        externals: [nodeExternals()],
      },
    }),
  );
};
