export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-config',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/admin/shared/config',
  preset: '../../../../jest.preset.js',
};
