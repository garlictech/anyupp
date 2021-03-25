import { awsConfig } from '@bgap/admin/amplify-api';
import {
  GraphqlApiKey,
  GraphqlApiUrl,
  testAdminUsername,
  testAdminUserPassword,
} from '../../../../common';
import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { catchError, switchMap, tap } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { from, of } from 'rxjs';
import { CreateAdminUser, DeleteAdminUser } from '@bgap/api/graphql/schema';

Amplify.configure({
  ...awsConfig,
  // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
  authenticationFlowType: 'USER_PASSWORD_AUTH',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
});

describe('Testing backend seed state', () => {
  test('Test user must be present and we can log in', done => {
    const appsyncConfig = {
      ...awsConfig,
      aws_appsync_graphqlEndpoint: GraphqlApiUrl,
      aws_appsync_apiKey: GraphqlApiKey,
    };
    const apiClient = GraphqlApiFp.createAuthenticatedClient(
      appsyncConfig,
      console,
      true,
    );

    const userName = 'foobar@anyupp.com';

    from(Auth.signIn(testAdminUsername, testAdminUserPassword))
      .pipe(
        switchMap(() =>
          apiClient
            .mutate(DeleteAdminUser, {
              userName,
            })
            .pipe(
              catchError(err => {
                console.warn('Probably normal error: ', err);
                return of({});
              }),
            ),
        ),
        switchMap(() =>
          apiClient
            .mutate(CreateAdminUser, {
              input: { email: 'foobar' },
            })
            .pipe(
              catchError(err => {
                expect(err).toMatchSnapshot('Malformed email error');
                return of({});
              }),
            ),
        ),
        switchMap(() =>
          apiClient
            .mutate(CreateAdminUser, {
              input: {},
            })
            .pipe(
              catchError(err => {
                expect(err).toMatchSnapshot('Missing email error');
                return of({});
              }),
            ),
        ),
        switchMap(() =>
          apiClient.mutate(CreateAdminUser, {
            input: { email: userName },
          }),
        ),
        tap(result =>
          expect(result).toMatchSnapshot('Successful user creation with email'),
        ),
        switchMap(() =>
          apiClient
            .mutate(CreateAdminUser, {
              input: { email: userName },
            })
            .pipe(
              catchError(err => {
                expect(err).toMatchSnapshot('Should not create existing user');
                return of({});
              }),
            ),
        ),
      )
      .subscribe(
        () => done(),
        e => {
          throw e;
        },
      );
  }, 40000);
});
