export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-store-product-categories',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/admin/store/product-categories',
  preset: '../../../../jest.preset.js',
};
