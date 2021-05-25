import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { AdminUserResolverDeps } from './utils';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const createAdminUser = (
  vars: AnyuppApi.CreateAdminUserMutationVariables,
) => (deps: AdminUserResolverDeps) => {
  console.debug('Resolver parameters: ', vars);
  const Username = vars.input.email || vars.input.phone || '';

  return pipe(
    {
      UserPoolId: deps.userPoolId,
      Username,
    },
    params => cognitoidentityserviceprovider.adminCreateUser(params).promise(),
    from,
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminGetUser({
            UserPoolId: deps.userPoolId,
            Username,
          })
          .promise(),
      ),
    ),
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    filter(fp.negate(fp.isEmpty)),
    map((adminUserId: string) => ({
      id: adminUserId,
      name: vars.input.name,
      email: vars.input.email,
      phone: vars.input.phone,
    })),
    switchMap(input => deps.crudSdk.CreateAdminUser({ input })),
    map(data => data?.id),
  ).toPromise();
};
