module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'api-graphql-appsync-lambda',
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/api/graphql/appsync-lambda',
};
