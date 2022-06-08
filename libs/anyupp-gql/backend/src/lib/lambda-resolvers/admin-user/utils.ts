import { CognitoIdentityServiceProvider, DynamoDB } from 'aws-sdk';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { CrudSdk } from '@bgap/crud-gql/api';
import { AdminUser, Maybe } from '@bgap/domain';

export interface AdminUserResolverDeps {
  userPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
  userNameGenerator: () => string;
  docClient: DynamoDB.DocumentClient;
  adminUserTableName: string;
}

export const deleteAdminUserFromTable =
  (deps: AdminUserResolverDeps) =>
  (username: string): ReturnType<CrudSdk['DeleteAdminUser']> =>
    from(
      deps.docClient
        .delete({
          TableName: deps.adminUserTableName,
          Key: {
            id: username,
          },
        })
        .promise(),
    ).pipe(map(res => res.Attributes as Maybe<AdminUser>));
