export default {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'admin-shared-pipes',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',

      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../../../coverage/libs/admin/shared/pipes',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@angular)',
    'node_modules/(?!.*\\.mjs$)',
  ],
  preset: '../../../../jest.preset.js',
};
