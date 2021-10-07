import * as CrudApi from '@bgap/crud-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';
import { from, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import { AdminUserResolverDeps, deleteAdminUserFromTable } from './utils';

export const deleteAdminUser =
  (params: CrudApi.DeleteAdminUserMutationVariables) =>
  (
    deps: AdminUserResolverDeps,
  ): ReturnType<CrudApi.CrudSdk['DeleteAdminUser']> => {
    console.debug('deleteAdminUser Resolver parameters: ', params);

    return from(
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
    );
  };
