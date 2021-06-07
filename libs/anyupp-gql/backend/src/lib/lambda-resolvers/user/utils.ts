import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';

export interface UserResolverDeps {
  anyuppSdk: AnyuppSdk;
  consumerUserPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export const createConfirmedUserInCognito = (deps: UserResolverDeps) => ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}): Observable<CognitoIdentityServiceProvider.AdminSetUserPasswordResponse> =>
  of('LETS CREATE AN CONFIRMED USER').pipe(
    // CREATE USER
    switchMap(() =>
      from(
        deps.cognitoidentityserviceprovider
          .adminCreateUser({
            UserPoolId: deps.consumerUserPoolId,
            Username: email,
            UserAttributes: [{ Name: 'name', Value: name }],
          })
          .promise(),
      ),
    ),
    // SET PASSWORD to PERMANENT and the ACCOUNT to CONFIRMED
    switchMap(() =>
      from(
        deps.cognitoidentityserviceprovider
          .adminSetUserPassword({
            Password: password,
            UserPoolId: deps.consumerUserPoolId,
            Username: email,
            Permanent: true,
          })
          .promise(),
      ),
    ),
  );
