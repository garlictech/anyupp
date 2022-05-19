export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-data',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/admin/shared/data-access/data',
  preset: '../../../../../jest.preset.js',
};
