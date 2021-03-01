module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-data-access-graphql-client',
  preset: '../../../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/admin/shared/data-access/graphql-client',
};
