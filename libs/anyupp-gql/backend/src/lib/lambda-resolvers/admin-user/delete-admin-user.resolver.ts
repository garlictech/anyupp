import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from } from 'rxjs';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { AdminUserResolverDeps } from './utils';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const deleteAdminUser =
  (params: AnyuppApi.DeleteAdminUserMutationVariables) =>
  (deps: AdminUserResolverDeps) => {
    console.debug('Resolver parameters: ', params);
    let userId: string;

    return from(
      cognitoidentityserviceprovider
        .adminGetUser({
          UserPoolId: deps.userPoolId,
          Username: params.userName,
        })
        .promise(),
    )
      .pipe(
        map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
          pipe(
            user.UserAttributes,
            fp.find(attr => attr.Name === 'sub'),
            attr => attr?.Value,
          ),
        ),
        filter(fp.negate(fp.isEmpty)),
        tap((sub: string) => (userId = sub)),
        switchMap(() =>
          cognitoidentityserviceprovider
            .adminDeleteUser({
              UserPoolId: deps.userPoolId,
              Username: params.userName,
            })
            .promise(),
        ),
        switchMap(() =>
          deps.crudSdk.DeleteAdminUser({ input: { id: userId } }),
        ),
        mapTo(true),
      )
      .toPromise();
  };
