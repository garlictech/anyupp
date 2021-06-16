module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-data-access-groups',
  preset: '../../../../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/admin/shared/data-access/groups',
};
