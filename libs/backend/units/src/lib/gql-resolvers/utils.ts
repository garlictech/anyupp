import { CrudSdk } from '@bgap/crud-gql/api';
import { Observable } from 'rxjs';
import { DynamoDB } from 'aws-sdk';

export interface UnitsResolverDeps {
  crudSdk: CrudSdk;
  hashGenerator: (arg: string) => string;
  uuidGenerator: () => string;
  tableName: string;
  docClient: DynamoDB.DocumentClient;
}

export type RegenerateUnitDataHandler = (unitId: string) => Observable<boolean>;
