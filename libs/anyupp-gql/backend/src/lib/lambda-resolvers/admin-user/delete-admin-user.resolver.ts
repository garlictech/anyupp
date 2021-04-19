import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { from } from 'rxjs';
import { filter, map, mapTo, switchMap, tap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const UserPoolId = process.env.userPoolId || '';

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
        executeMutation(crudBackendGraphQLClient)<
          CrudApi.DeleteAdminUserMutation
        >(CrudApiMutationDocuments.deleteAdminUser, {
          input: { id: userId },
        }),
      ),
      mapTo(true),
    )
    .toPromise();
};
