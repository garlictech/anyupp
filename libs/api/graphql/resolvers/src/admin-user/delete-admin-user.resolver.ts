import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import { from, Observable, throwError } from 'rxjs';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import {
  awsConfig,
  deleteAdminUser as amplifyDeleteAdminUser,
  AdminUser as AmplifyAdminUser,
} from '@bgap/admin/amplify-api';
import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import { DeleteAdminUserMutationVariables } from '@bgap/api/graphql/schema';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

Amplify.configure(awsConfig);

export const deleteAdminUser = (params: DeleteAdminUserMutationVariables) => {
  console.debug('Resolver parameters: ', params);
  let userId: string;

  return (
    from(
      cognitoidentityserviceprovider
        .adminGetUser({
          UserPoolId,
          Username: params.userName,
        })
        .promise(),
    ),
    tap(x => console.debug('Step 1 result:', x)),
    map((user: CognitoIdentityServiceProvider.Types.AdminGetUserResponse) =>
      pipe(
        user.UserAttributes,
        fp.find(attr => attr.Name === 'sub'),
        attr => attr?.Value,
      ),
    ),
    tap(x => console.debug('Step 2 result:', x)),
    filter(fp.negate(fp.isEmpty)),
    tap((sub: string) => (userId = sub)),
    tap(x => console.debug('Step 3 result:', x)),
    switchMap(() =>
      cognitoidentityserviceprovider
        .adminDeleteUser({
          UserPoolId,
          Username: params.userName,
        })
        .promise(),
    ),
    tap(x => console.debug('Step 4 result:', x)),
    switchMap(() =>
      pipe(
        API.graphql(
          graphqlOperation(amplifyDeleteAdminUser, { input: { id: userId } }),
        ),
        operation =>
          operation instanceof Promise
            ? (from(operation) as Observable<GraphQLResult<AmplifyAdminUser>>)
            : throwError('Wrong graphql operation'),
      ),
    ),
    tap(x => console.debug('Step 5 result:', x)),
    mapTo(true)
  );
};
