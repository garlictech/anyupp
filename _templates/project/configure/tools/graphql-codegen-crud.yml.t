---
to: tools/graphql-codegen-crud.yml
---
overwrite: true
schema:
  - libs/gql-sdk/src/schema/aws.graphql
  - apps/crud-backend/amplify/backend/api/<%= h.changeCase.lower(h.changeCase.camelCase(app)) %>/build/schema.graphql
documents:
  - libs/crud-gql/backend/src/graphql/documents/*.graphql
  - libs/crud-gql/api/src/lib/generated/graphql/*.ts
generates:
  libs/crud-gql/api/src/lib/generated/api.ts:
    hooks:
      afterOneFileWrite:
        - prettier --write
    plugins:
      - typescript
      - typescript-operations
      - typescript-generic-sdk
    config:
      declarationKind: 'interface'
      defaultScalarType: unknown
      skipTypename: true
      namingConvention:
        enumValues: change-case#lowerCase
      usingObservableFrom: "import { Observable } from 'rxjs';"
      scalars:
        AWSDateTime: string
