export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'anyupp-backend',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  modulePathIgnorePatterns: ['cdk.out', '.build', '.serverless'],
  coverageDirectory: '../../coverage/apps/anyupp-backend',
  preset: '../../jest.preset.js',
};
