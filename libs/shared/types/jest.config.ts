module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'shared-types',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/types',
  preset: '../../../jest.preset.ts',
};
