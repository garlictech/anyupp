module.exports = {
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  displayName: 'infrastructure-build-pipeline-stack',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/apps/infrastructure/build-pipeline-stack',
};
