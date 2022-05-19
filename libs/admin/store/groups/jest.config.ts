export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-store-groups',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/admin/store/groups',
  preset: '../../../../jest.preset.js',
};
