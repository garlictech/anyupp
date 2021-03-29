import { awsConfig, AmplifyApi } from '@bgap/admin/amplify-api';
import {
  GraphqlApiKey,
  GraphqlApiUrl,
  testAdminUsername,
  testAdminUserPassword,
} from '../../../../common';
import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import Amplify, { Auth } from 'aws-amplify';
import { from, Observable, of } from 'rxjs';
import { CreateAdminUser, DeleteAdminUser } from '@bgap/api/graphql/schema';
import { ApolloQueryResult } from 'apollo-client';

Amplify.configure({
  ...awsConfig,
  // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
  authenticationFlowType: 'USER_PASSWORD_AUTH',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
});

describe('Admin user creation/deletion', () => {
  test('Admin user should be created/deleted', done => {
    const appsyncConfig = {
      ...awsConfig,
      aws_appsync_graphqlEndpoint: GraphqlApiUrl,
      aws_appsync_apiKey: GraphqlApiKey,
    };
    const appsyncApiClient = GraphqlApiFp.createAuthenticatedClient(
      appsyncConfig,
      console,
      true,
    );

    const userName = 'foobar@anyupp.com';

    from(Auth.signIn(testAdminUsername, testAdminUserPassword))
      .pipe(
        switchMap(() =>
          appsyncApiClient
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
          appsyncApiClient
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
          appsyncApiClient
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
          appsyncApiClient.mutate(CreateAdminUser, {
            input: { email: userName },
          }),
        ),
        x =>
          x as Observable<
            ApolloQueryResult<AmplifyApi.CreateAdminUserMutation>
          >,
        map(result => result.data.createAdminUser),
        switchMap(() =>
          appsyncApiClient
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
        // Cleanup
        switchMap(() =>
          appsyncApiClient.mutate(DeleteAdminUser, {
            userName,
          }),
        ),
        tap(result => expect(result).toMatchSnapshot('Cleanup')),
      )
      .subscribe(
        () => done(),
        e => {
          throw e;
        },
      );
  }, 40000);
});
