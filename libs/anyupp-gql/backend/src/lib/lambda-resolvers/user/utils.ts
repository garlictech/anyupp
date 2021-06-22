import { AnyuppSdk, CreateAnonymUserOutput } from '@bgap/anyupp-gql/api';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { defer, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  username?: string;
}

export const createConfirmedUserInCognito = (deps: {
  userPoolId: string;
  cognitoidentityserviceprovider: CognitoIdentityServiceProvider;
}) => (input: CreateConfirmedUserInput): Observable<CreateAnonymUserOutput> => {
  const username = input.username ? input.username : uuidV1();

  return defer(() =>
    deps.cognitoidentityserviceprovider
      .adminCreateUser({
        UserPoolId: deps.userPoolId,
        Username: username,
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
            Username: username,
            Permanent: true,
          })
          .promise(),
      ).pipe(
        map(() => {
          if (newUser.User?.Username !== username) {
            throw new Error('The Just created UserId is missing');
          }
          return {
            pwd: input.password,
            username,
          };
        }),
      ),
    ),
  );
};
