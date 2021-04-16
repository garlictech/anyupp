import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from, throwError } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import API, { graphqlOperation, GraphQLResult, GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
  awsConfig,
} from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/graphql/schema';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

Amplify.configure(awsConfig);

export const createAdminUser = (
  vars: AppsyncApi.CreateAdminUserMutationVariables,
) => {
  console.debug('Resolver parameters: ', vars);
  const Username = vars.input.email || vars.input.phone || '';

  return pipe(
    {
      UserPoolId: UserPoolId,
      Username,
    },
    params => cognitoidentityserviceprovider.adminCreateUser(params).promise(),
    from,
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
    switchMap((input: AmplifyApi.CreateAdminUserInput) =>
      pipe(
        API.graphql(
          graphqlOperation(AmplifyApiMutationDocuments.createAdminUser, {
            input,
            authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
          }),
        ),
        operation =>
          operation instanceof Promise
            ? from(operation)
            : throwError('Wrong graphql operation'),
      ),
    ),
    map(
      (data: GraphQLResult<AmplifyApi.CreateAdminUserMutation>) =>
        data.data?.createAdminUser?.id,
    ),
  ).toPromise();
};
