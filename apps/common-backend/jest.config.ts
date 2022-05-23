module.exports = {
  displayName: 'common-backend',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  modulePathIgnorePatterns: ['cdk.out', '.build', '.serverless'],
  coverageDirectory: '../../coverage/apps/common-backend',
  preset: '../../jest.preset.ts',
};
