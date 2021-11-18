module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-data-access-orders',
  preset: '../../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',

      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory:
    '../../../../../coverage/libs/admin/shared/data-access/orders',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: { '^.+\\.(ts|js|html|mjs)$': 'jest-preset-angular' },
  transformIgnorePatterns: [
    'node_modules/(?!@angular)',
    'node_modules/(?!.*\\.mjs$)',
  ],
};
