import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { defer, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';
import { v1 as uuidV1 } from 'uuid';

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
  (input: CreateConfirmedUserInput): Observable<CreateConfirmedUserOutput> => {
    const userName = uuidV1();

    return defer(() =>
      deps.cognitoidentityserviceprovider
        .adminCreateUser({
          UserPoolId: deps.userPoolId,
          Username: userName,
          UserAttributes: [
            {
              Name: 'email',
              Value: input.email,
            },
            {
              Name: 'name',
              Value: input.name,
            },
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
        })
        .promise(),
    ).pipe(
      switchMap(newUser =>
        from(
          deps.cognitoidentityserviceprovider
            .adminSetUserPassword({
              Password: input.password,
              UserPoolId: deps.userPoolId,
              Username: userName,
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
  };
