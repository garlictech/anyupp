export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'anyupp-global',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  modulePathIgnorePatterns: ['cdk.out', '.build', '.serverless'],
  coverageDirectory: '../../coverage/apps/anyupp-global',
  preset: '../../jest.preset.js',
};
