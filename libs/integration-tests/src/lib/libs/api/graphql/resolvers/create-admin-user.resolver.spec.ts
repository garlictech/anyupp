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
import { ApolloQueryResult } from 'apollo-client';
import { AppsyncApi } from '@bgap/api/graphql/schema';

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
            .mutate(AppsyncApi.DeleteAdminUser, {
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
            .mutate(AppsyncApi.CreateAdminUser, {
              input: { email: 'foobar', name: 'Mekk elek', phone: '12356666' },
            })
            .pipe(
              catchError(err => {
                expect(err).toMatchSnapshot('Malformed email error');
                return of(err);
              }),
            ),
        ),
        switchMap(() =>
          appsyncApiClient.mutate(AppsyncApi.CreateAdminUser, {
            input: { email: userName, name: 'Mekk Elek', phone: '123456' },
          }),
        ),
        x =>
          x as Observable<
            ApolloQueryResult<AmplifyApi.CreateAdminUserMutation>
          >,
        map(result => result.data.createAdminUser),
        switchMap(() =>
          appsyncApiClient
            .mutate(AppsyncApi.CreateAdminUser, {
              input: { email: userName, name: 'Mekk Elek', phone: '123456' },
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
          appsyncApiClient.mutate(AppsyncApi.DeleteAdminUser, {
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
