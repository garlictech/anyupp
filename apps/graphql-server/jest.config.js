module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/graphql-server',
  displayName: 'graphql-server',
};
