import { ApolloQueryResult } from 'apollo-client';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { CrudApi } from '@bgap/crud-gql/api';
import {
  AuthenticatdGraphQlClientWithUserId,
  createAuthenticatedAppsyncGraphQlClient,
} from '@bgap/shared/graphql/api-client';

import { testAdminUsername, testAdminUserPassword } from '../../../fixtures';

describe('Admin user creation/deletion', () => {
  let authHelper: AuthenticatdGraphQlClientWithUserId;

  beforeAll(async () => {
    authHelper = await createAuthenticatedAppsyncGraphQlClient(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();
    console.warn(authHelper.userAttributes);
  });

  test('Admin user should be created/deleted', done => {
    const userName = 'foobar@anyupp.com';

    of('BEGINNING_OF_A_BEAUTIFUL_JOURNEY')
      .pipe(
        switchMap(() =>
          authHelper.graphQlClient
            .mutate(AnyuppApi.DeleteAdminUser, {
              userName,
            })
            .pipe(
              catchError((err: Error) => {
                if (!err.message.includes('User does not exist')) {
                  console.warn('Probably normal error: ', err);
                }
                return of({});
              }),
            ),
        ),
        switchMap(() =>
          authHelper.graphQlClient
            .mutate(AnyuppApi.CreateAdminUser, {
              input: {
                email: 'foobar',
                name: 'Mekk elek',
                phone: '12356666',
              },
            })
            .pipe(
              catchError(err => {
                expect(err).toMatchSnapshot('Malformed email error');
                return of(err);
              }),
            ),
        ),
        switchMap(() =>
          authHelper.graphQlClient.mutate(AnyuppApi.CreateAdminUser, {
            input: { email: userName, name: 'Mekk Elek', phone: '123456' },
          }),
        ),
        x =>
          x as Observable<ApolloQueryResult<CrudApi.CreateAdminUserMutation>>,
        map(result => result.data.createAdminUser),
        switchMap(() =>
          authHelper.graphQlClient
            .mutate(AnyuppApi.CreateAdminUser, {
              input: {
                email: userName,
                name: 'Mekk Elek',
                phone: '123456',
              },
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
          authHelper.graphQlClient.mutate(AnyuppApi.DeleteAdminUser, {
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
