const nxPreset = require('@nrwl/jest/preset').default;
module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  moduleFileExtensions: ['ts', 'js', 'html', 'tsx', 'jsx'],
  reporters: ['default'],
  passWithNoTests: true,
  detectOpenHandles: true,
  forceExit: true,
  coverage: true,
  clearMocks: true,
  extensionsToTreatAsEsm: ['.ts'],
};
