import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { CreateAdminUserMutationVariables } from '@bgap/api/graphql/schema';
import { from, Observable, throwError } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import {
  awsConfig,
  createAdminUser as amplifyCreateAdminUser,
  CreateAdminUserInput as AmplifyCreateAdminUserInput,
  AdminUser as AmplifyAdminUser,
} from '@bgap/admin/amplify-api';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

Amplify.configure(awsConfig);

export const createAdminUser = (vars: CreateAdminUserMutationVariables) => {
  console.debug('Resolver parameters: ', vars);

  const Username = vars.input.email || vars.input.phone || '';
  console.debug('Username: ', Username);

  return pipe(
    {
      UserPoolId: UserPoolId,
      Username,
    },
    params => cognitoidentityserviceprovider.adminCreateUser(params).promise(),
    from,
    tap(x => console.debug('Step 1 result:', x)),
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminGetUser({
            UserPoolId,
            Username,
          })
          .promise(),
      ),
    ),
    tap(x => console.debug('Step 2 result:', x)),
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    filter(fp.negate(fp.isEmpty)),
    tap(x => console.debug('Step 3 result:', x)),
    map((adminUserId: string) => ({
      id: adminUserId,
      email: vars.input.email,
      phone: vars.input.phone,
    })),
    tap(x => console.debug('Step 4 result:', x)),
    switchMap((input: AmplifyCreateAdminUserInput) =>
      pipe(
        API.graphql(graphqlOperation(amplifyCreateAdminUser, { input })),
        operation =>
          operation instanceof Promise
            ? (from(operation) as Observable<GraphQLResult<AmplifyAdminUser>>)
            : throwError('Wrong graphql operation'),
      ),
    ),
    tap(x => console.debug('Step 5 result:', x)),
    map((data: GraphQLResult<AmplifyAdminUser>) => data.data?.id),
    tap(x => console.debug('Step 6 result:', x)),
  );
};
