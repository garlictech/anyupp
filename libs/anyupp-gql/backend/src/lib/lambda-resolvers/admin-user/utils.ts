import { CrudSdk } from '@bgap/crud-gql/api';

export interface AdminUserResolverDeps {
  userPoolId: string;
  crudSdk: CrudSdk;
}
