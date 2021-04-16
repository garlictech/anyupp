import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from, Observable, throwError } from 'rxjs';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';

import API, { graphqlOperation, GraphQLResult } from '@aws-amplify/api-graphql';
import Amplify from '@aws-amplify/core';
import {
  CrudApi,
  CrudApiMutationDocuments,
  awsConfig,
} from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

Amplify.configure(awsConfig);

export const deleteAdminUser = (
  params: AnyuppApi.DeleteAdminUserMutationVariables,
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
            graphqlOperation(CrudApiMutationDocuments.deleteAdminUser, {
              input: { id: userId },
            }),
          ),
          operation =>
            operation instanceof Promise
              ? (from(operation) as Observable<
                  GraphQLResult<CrudApi.AdminUser>
                >)
              : throwError('Wrong graphql operation'),
        ),
      ),
      mapTo(true),
    )
    .toPromise();
};
