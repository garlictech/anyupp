import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';

export interface UserResolverDeps {
  anyuppSdk: AnyuppSdk;
  consumerUserPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}

export interface CreateConfirmedUserInput {
  email: string;
  password: string;
  name: string;
}
export interface CreateConfirmedUserOutput extends CreateConfirmedUserInput {
  userId: string;
}

export const createConfirmedUserInCognito =
  (deps: {
    userPoolId: string;
    cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
  }) =>
  (input: CreateConfirmedUserInput): Observable<CreateConfirmedUserOutput> =>
    of('LETS CREATE AN CONFIRMED USER').pipe(
      // CREATE USER
      switchMap(() =>
        from(
          deps.cognitoidentityserviceprovider
            .adminCreateUser({
              UserPoolId: deps.userPoolId,
              Username: input.email,
              UserAttributes: [{ Name: 'name', Value: input.name }],
            })
            .promise(),
        ),
      ),
      // SET PASSWORD to PERMANENT and the ACCOUNT to CONFIRMED
      switchMap(newUser =>
        from(
          deps.cognitoidentityserviceprovider
            .adminSetUserPassword({
              Password: input.password,
              UserPoolId: deps.userPoolId,
              Username: input.email,
              Permanent: true,
            })
            .promise(),
        ).pipe(
          map(() => {
            const userId = newUser.User?.Attributes?.find(
              x => x.Name === 'sub',
            )?.Value;
            if (!userId) {
              throw new Error('The Just created UserId is missing');
            }
            return {
              ...input,
              userId: userId,
            };
          }),
        ),
      ),
    );
