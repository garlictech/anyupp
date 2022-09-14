import { CrudSdk } from '@bgap/crud-gql/api';

export interface OrderHandlerDeps {
  crudSdk: CrudSdk;
  timestamp: () => number;
}
