export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'anyupp-gql-backend',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/anyupp-gql/backend',
  preset: '../../../jest.preset.js',
};
