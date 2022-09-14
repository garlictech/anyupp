import { CrudSdk } from '@bgap/crud-gql/api';
import { DynamoDB } from 'aws-sdk';

export interface UnitsResolverDeps {
  crudSdk: CrudSdk;
  hashGenerator: (arg: string) => string;
  uuidGenerator: () => string;
  tableName: string;
  docClient: DynamoDB.DocumentClient;
}
