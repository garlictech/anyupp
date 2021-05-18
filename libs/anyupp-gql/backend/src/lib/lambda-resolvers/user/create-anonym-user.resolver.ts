import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { from, Observable, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { v1 as uuidV1 } from 'uuid';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

export const createAnonymUser = ({
  crudGraphqlClient,
  cognito,
  consumerUserPoolId,
}: {
  crudGraphqlClient: GraphqlApiClient;
  cognito: CognitoIdentityServiceProvider;
  consumerUserPoolId: string;
}): Observable<AnyuppApi.CreateAnonymUserOutput> => {
  const generatedId = uuidV1();
  const email = `${generatedId}@${generatedId}.hu`;
  const pwd = uuidV1() + 'UPPERCASE';

  return of('LETS CREATE AN ANONYMUS USER').pipe(
    // CREATE USER
    switchMap(() =>
      from(
        cognito
          .adminCreateUser({
            UserPoolId: consumerUserPoolId,
            Username: email,
            UserAttributes: [{ Name: 'name', Value: 'AnonymUser' }],
          })
          .promise(),
      ),
    ),
    // SET PASSWORD to PERMANENT and the ACCOUNT to CONFIRMED
    switchMap(() =>
      from(
        cognito
          .adminSetUserPassword({
            Password: pwd,
            UserPoolId: consumerUserPoolId,
            Username: email,
            Permanent: true,
          })
          .promise(),
      ),
    ),
    mapTo({
      email,
      pwd,
    }),
  );
};
