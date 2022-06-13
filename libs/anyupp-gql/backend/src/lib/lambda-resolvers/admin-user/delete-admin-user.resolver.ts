import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';
import { defer, from, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  throwIfEmpty,
} from 'rxjs/operators';

import { CrudSdk } from '@bgap/crud-gql/api';
import { DeleteAdminUserMutationVariables } from '@bgap/domain';

import { AdminUserResolverDeps, deleteAdminUserFromTable } from './utils';

export const deleteAdminUser =
  (params: DeleteAdminUserMutationVariables) =>
  (deps: AdminUserResolverDeps): ReturnType<CrudSdk['DeleteAdminUser']> => {
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
