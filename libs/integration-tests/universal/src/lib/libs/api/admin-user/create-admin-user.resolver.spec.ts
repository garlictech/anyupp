import { of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import {
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedAnyuppGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

import { pipeDebug } from '../../../../../../../shared/utils/src/lib/fn/utils';
import { testAdminUsername, testAdminUserPassword } from '../../../fixtures';

describe('Admin user creation/deletion', () => {
  let authHelper: AuthenticatdGraphQLClientWithUserId;

  beforeAll(async () => {
    authHelper = await createAuthenticatedAnyuppGraphQLClient(
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
          executeMutation(authHelper.graphQlClient)<
            AnyuppApi.DeleteAdminUserMutation
          >(AnyuppApi.DeleteAdminUser, {
            userName,
          }).pipe(
            catchError((err: Error) => {
              console.log(
                '### ~ file: create-admin-user.resolver.spec.ts ~ line 39 ~ catchError ~ err',
                err,
              );
              if (!err.message.includes('User does not exist')) {
                console.warn('Probably normal error: ', err);
              }
              return of({ fesf: 'FOOOOO' });
            }),
          ),
        ),
        pipeDebug('### AFTER DELETE'),
        switchMap(() =>
          executeMutation(authHelper.graphQlClient)<
            AnyuppApi.CreateAdminUserMutation
          >(AnyuppApi.CreateAdminUser, {
            input: {
              email: 'foobar',
              name: 'Mekk elek',
              phone: '12356666',
            },
          }).pipe(
            catchError(err => {
              expect(err).toMatchSnapshot('Malformed email error');
              return of(err);
            }),
          ),
        ),
        pipeDebug('### AFTER CREATE MALFORMED'),
        switchMap(() =>
          executeMutation(authHelper.graphQlClient)<
            AnyuppApi.CreateAdminUserMutation
          >(AnyuppApi.CreateAdminUser, {
            input: { email: userName, name: 'Mekk Elek', phone: '123456' },
          }),
        ),
        map(result => result.createAdminUser),
        pipeDebug('### AFTER CREATE'),
        switchMap(() =>
          executeMutation(authHelper.graphQlClient)<
            AnyuppApi.CreateAdminUserMutation
          >(AnyuppApi.CreateAdminUser, {
            input: {
              email: userName,
              name: 'Mekk Elek',
              phone: '123456',
            },
          }).pipe(
            catchError(err => {
              expect(err).toMatchSnapshot('Should not create existing user');
              return of({});
            }),
          ),
        ),
        pipeDebug('### AFTER EXISTING USER'),
        // Cleanup
        switchMap(() =>
          executeMutation(authHelper.graphQlClient)<
            AnyuppApi.DeleteAdminUserMutation
          >(AnyuppApi.DeleteAdminUser, {
            userName,
          }).pipe(
            catchError((err: Error) => {
              console.log(
                '### ~ file: create-admin-user.resolver.spec.ts ~ line 102 ~ catchError ~ err',
                err,
              );
              return throwError(err);
            }),
          ),
        ),
        pipeDebug('### AFTER CLEANUP'),
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
