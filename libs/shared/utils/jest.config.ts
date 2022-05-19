export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'shared-utils',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/utils',
  preset: '../../../jest.preset.js',
};
