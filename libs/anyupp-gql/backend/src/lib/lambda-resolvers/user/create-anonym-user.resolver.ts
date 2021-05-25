import { from, Observable, of } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';
import { v1 as uuidV1 } from 'uuid';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UserResolverDeps } from './utils';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

export const createAnonymUser = (
  deps: UserResolverDeps,
): Observable<AnyuppApi.CreateAnonymUserOutput> => {
  const generatedId = uuidV1();
  const email = `${generatedId}@${generatedId}.hu`;
  const pwd = uuidV1() + 'UPPERCASE';

  return of('LETS CREATE AN ANONYMUS USER').pipe(
    // CREATE USER
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminCreateUser({
            UserPoolId: deps.consumerUserPoolId,
            Username: email,
            UserAttributes: [{ Name: 'name', Value: 'AnonymUser' }],
          })
          .promise(),
      ),
    ),
    // SET PASSWORD to PERMANENT and the ACCOUNT to CONFIRMED
    switchMap(() =>
      from(
        cognitoidentityserviceprovider
          .adminSetUserPassword({
            Password: pwd,
            UserPoolId: deps.consumerUserPoolId,
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
