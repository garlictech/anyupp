const graphql = require('@nestjs/graphql');
const path = require('path');

const SCHEMA_ROOT = path.join(process.cwd(), 'libs/api/graphql/schema/src');

console.error('SCHEMA_ROOT', SCHEMA_ROOT);
const definitionsFactory = new graphql.GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: [`${SCHEMA_ROOT}/schema/**/*.graphql`],
  path: `${SCHEMA_ROOT}/lib/api.ts`,
  outputAs: 'class',
  emitTypenameField: true,
  watch: true,
});
