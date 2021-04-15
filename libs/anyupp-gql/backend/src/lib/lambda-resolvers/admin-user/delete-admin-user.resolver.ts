import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from, Observable, throwError } from 'rxjs';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';

import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
  awsConfig,
} from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/appsync-gql';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

Amplify.configure(awsConfig);

export const deleteAdminUser = (
  params: AppsyncApi.DeleteAdminUserMutationVariables,
) => {
  console.debug('Resolver parameters: ', params);
  let userId: string;

  return from(
    cognitoidentityserviceprovider
      .adminGetUser({
        UserPoolId,
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
            UserPoolId,
            Username: params.userName,
          })
          .promise(),
      ),
      switchMap(() =>
        pipe(
          API.graphql(
            graphqlOperation(AmplifyApiMutationDocuments.deleteAdminUser, {
              input: { id: userId },
            }),
          ),
          operation =>
            operation instanceof Promise
              ? (from(operation) as Observable<
                  GraphQLResult<AmplifyApi.AdminUser>
                >)
              : throwError('Wrong graphql operation'),
        ),
      ),
      mapTo(true),
    )
    .toPromise();
};
