export default {
  displayName: 'integration-tests-universal',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/integration-tests/universal',
  preset: '../../../jest.preset.js',
};
