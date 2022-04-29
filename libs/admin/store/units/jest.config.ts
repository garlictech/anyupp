module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-store-units',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/admin/store/units',
  preset: '../../../../jest.preset.ts',
};
