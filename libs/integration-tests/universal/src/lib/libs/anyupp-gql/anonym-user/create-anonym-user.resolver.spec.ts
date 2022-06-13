import { createAnonymUser, UserResolverDeps } from '@bgap/anyupp-gql/backend';
import { config } from '@bgap/shared/config';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { getCrudSdkPublic } from '@bgap/crud-gql/api';
import { from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

const TEST_NAME = 'CREATEANONYM_';
const consumerUserPoolId = config.ConsumerUserPoolId;
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

describe('Anonym user creation', () => {
  const deps: UserResolverDeps = {
    crudSdk: getCrudSdkPublic(),
    consumerUserPoolId: config.ConsumerUserPoolId,
    cognitoidentityserviceprovider,
  };

  test('Anonym user should be created/deleted', done => {
    createAnonymUser(deps)
      .pipe(
        // USE this to check the endpoint registration, permissions, etc, the whole endpoint
        // switchMap(() =>
        //   executeMutation(anyuppGraphQLClient)<
        //     CreateAnonymUserMutation
        //   >(CreateAnonymUser).pipe(map(x => x.createAnonymUser)),
        // ),
        tap({
          next(result) {
            // SHOULD RETURN THE email and password
            expect(result).toHaveProperty('username');
            expect(result).toHaveProperty('pwd');
          },
        }),

        // THE NEW USER SHOULD BE ABLE TO AUTHENTICATE
        switchMap(props =>
          from(
            cognitoidentityserviceprovider
              .initiateAuth({
                ClientId: config.ConsumerWebUserPoolClientId,
                AuthFlow: 'USER_PASSWORD_AUTH',
                AuthParameters: {
                  USERNAME: props.username,
                  PASSWORD: props.pwd,
                },
              })
              .promise(),
          ).pipe(
            map(initiateAuthResponse => ({ ...props, initiateAuthResponse })),
          ),
        ),
        tap({
          next(props) {
            expect(
              props.initiateAuthResponse.AuthenticationResult?.AccessToken,
            ).not.toBeUndefined();
            expect(
              props.initiateAuthResponse.AuthenticationResult?.RefreshToken,
            ).not.toBeUndefined();
            expect(
              props.initiateAuthResponse.AuthenticationResult?.TokenType,
            ).toEqual('Bearer');
          },
        }),

        // CHECK the name:AnonymUser user attribute on the cognito user
        switchMap(props =>
          from(
            cognitoidentityserviceprovider
              .adminGetUser({
                UserPoolId: consumerUserPoolId,
                Username: props.username,
              })
              .promise(),
          ).pipe(
            map(adminGetUserResponse => ({ ...props, adminGetUserResponse })),
          ),
        ),
        tap({
          next(props) {
            expect(
              props.adminGetUserResponse.UserAttributes,
            ).not.toBeUndefined();
            const typeAttribute =
              props.adminGetUserResponse.UserAttributes?.find(
                x => x.Name === 'name',
              );
            expect(typeAttribute).not.toBeUndefined();
            expect(typeAttribute).toHaveProperty('Name', 'name');
            expect(typeAttribute).toHaveProperty('Value', 'AnonymUser');
          },
        }),

        // CLEANUP - delete the user
        switchMap(props =>
          from(
            cognitoidentityserviceprovider
              .adminDeleteUser({
                UserPoolId: consumerUserPoolId,
                Username: props.username,
              })
              .promise(),
          ),
        ),
      )
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
  }, 60000);
});
