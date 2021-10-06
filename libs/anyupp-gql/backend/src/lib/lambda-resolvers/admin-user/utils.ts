import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import * as CrudApi from '@bgap/crud-gql/api';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface AdminUserResolverDeps {
  userPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
  userNameGenerator: () => string;
  docClient: DynamoDB.DocumentClient;
  adminUserTableName: string;
}

export const deleteAdminUserFromTable =
  (deps: AdminUserResolverDeps) =>
  (username: string): ReturnType<CrudApi.CrudSdk['DeleteAdminUser']> =>
    from(
      deps.docClient
        .delete({
          TableName: deps.adminUserTableName,
          Key: {
            id: username,
          },
        })
        .promise(),
    ).pipe(map(res => res.Attributes as CrudApi.Maybe<CrudApi.AdminUser>));
