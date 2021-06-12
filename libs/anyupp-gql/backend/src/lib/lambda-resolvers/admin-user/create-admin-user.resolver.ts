import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { AdminUserResolverDeps } from './utils';
import { v1 as uuidV1 } from 'uuid';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const createAdminUser = (
  vars: AnyuppApi.CreateAdminUserMutationVariables,
) => (deps: AdminUserResolverDeps) => {
  console.debug('Resolver parameters: ', vars);
  const Username = vars.input.email || vars.input.phone;

  if (fp.isEmpty(Username)) {
    throw new Error('Either email or phone name must be provided');
  }

  return pipe(
    {
      Username: uuidV1(),
      UserAttributes: [
        {
          Name: 'email',
          Value: vars.input.email,
        },
        {
          Name: 'phone_number',
          Value: vars.input.phone,
        },
      ],
      UserPoolId: deps.userPoolId,
    },
    params => cognitoidentityserviceprovider.adminCreateUser(params).promise(),
    from,
    switchMap(() =>
      deps.crudSdk.CreateAdminUser({
        input: {
          name: vars.input.name,
          id: Username,
          email: vars.input.email,
          phone: vars.input.phone,
        },
      }),
    ),
    map(data => data?.id),
  ).toPromise();
};
