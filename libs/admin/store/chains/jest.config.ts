export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-store-chains',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/admin/store/chains',
  preset: '../../../../jest.preset.js',
};
