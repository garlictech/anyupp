---
to: apps/crud-backend/.graphqlconfig.yml 
---
projects:
  anyuppzsolt:
    schemaPath: amplify/backend/api/<%= h.changeCase.lower(h.changeCase.camelCase(app)) %>/build/schema.graphql
    includes:
      - ../../libs/crud-gql/api/src/lib/generated/graphql/**/*.ts
    excludes:
      - ./amplify/**
    extensions:
      amplify:
        codeGenTarget: typescript
        generatedFileName: ../../libs/crud-gql/api/src/lib/generated/api.ts
        docsFilePath: ../../libs/crud-gql/api/src/lib/generated/graphql
        region: eu-west-1
        apiId: null
        maxDepth: 4
extensions:
  amplify:
    version: 3
