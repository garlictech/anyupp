module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'shared-secrets',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/secrets',
  preset: '../../../jest.preset.ts',
};
