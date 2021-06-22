import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';
import { from } from 'rxjs';
import { filter, map, mapTo, switchMap } from 'rxjs/operators';
import { AdminUserResolverDeps } from './utils';

export const deleteAdminUser = (
  params: AnyuppApi.DeleteAdminUserMutationVariables,
) => (deps: AdminUserResolverDeps) => {
  console.debug('deleteAdminUser Resolver parameters: ', params);

  return from(
    deps.cognitoidentityserviceprovider
      .adminGetUser({
        UserPoolId: deps.userPoolId,
        Username: params.userName,
      })
      .promise(),
  )
    .pipe(
      map(
        (user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
          user.Username,
      ),
      filter(fp.negate(fp.isEmpty)),
      switchMap(username =>
        from(
          deps.cognitoidentityserviceprovider
            .adminDeleteUser({
              UserPoolId: deps.userPoolId,
              Username: username,
            })
            .promise(),
        ).pipe(mapTo(username)),
      ),
      switchMap(username =>
        deps.crudSdk.DeleteAdminUser({ input: { id: username } }),
      ),
      mapTo(true),
    )
    .toPromise();
};
