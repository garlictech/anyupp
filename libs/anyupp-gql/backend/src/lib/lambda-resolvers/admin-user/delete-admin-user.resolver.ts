import * as CrudApi from '@bgap/crud-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';
import { defer, from, of } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  throwIfEmpty,
  catchError,
} from 'rxjs/operators';
import { AdminUserResolverDeps, deleteAdminUserFromTable } from './utils';

export const deleteAdminUser =
  (params: CrudApi.DeleteAdminUserMutationVariables) =>
  (
    deps: AdminUserResolverDeps,
  ): ReturnType<CrudApi.CrudSdk['DeleteAdminUser']> => {
    console.debug('deleteAdminUser Resolver parameters: ', params);

    return defer(() =>
      deps.cognitoidentityserviceprovider
        .adminGetUser({
          UserPoolId: deps.userPoolId,
          Username: params.input.id,
        })
        .promise(),
    ).pipe(
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
        ),
      ),
      switchMap(() => deleteAdminUserFromTable(deps)(params.input.id)),
      throwIfEmpty(),
      catchError(err => of(err?.code === 'UserNotFoundException' ? null : err)),
    );
  };
