import { from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { createAuthenticatedAnyuppSdk } from '../../../../api-clients';
import { testAdminUsername, testAdminUserPassword } from '../../../fixtures';

describe('Admin user creation/deletion', () => {
  const authAnyuppSdk = createAuthenticatedAnyuppSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  test('Admin user should be created/deleted', done => {
    const userName = 'foobar@anyupp.com';

    authAnyuppSdk
      .pipe(
        switchMap(sdk =>
          from(sdk.DeleteAdminUser({ userName })).pipe(
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
            switchMap(() =>
              from(
                sdk.CreateAdminUser({
                  input: {
                    email: 'foobar',
                    name: 'Mekk elek',
                    phone: '12356666',
                  },
                }),
              ).pipe(
                catchError(err => {
                  expect(err).toMatchSnapshot('Malformed email error');
                  return of(err);
                }),
              ),
            ),
            switchMap(() =>
              from(
                sdk.CreateAdminUser({
                  input: {
                    email: userName,
                    name: 'Mekk Elek',
                    phone: '123456',
                  },
                }),
              ),
            ),
            switchMap(() =>
              from(
                sdk.CreateAdminUser({
                  input: {
                    email: userName,
                    name: 'Mekk Elek',
                    phone: '123456',
                  },
                }),
              ).pipe(
                catchError(err => {
                  expect(err).toMatchSnapshot(
                    'Should not create existing user',
                  );
                  return of({});
                }),
              ),
            ),
            // Cleanup
            switchMap(() =>
              from(sdk.DeleteAdminUser({ userName })).pipe(
                catchError((err: Error) => {
                  console.log(
                    '### ~ file: create-admin-user.resolver.spec.ts ~ line 102 ~ catchError ~ err',
                    err,
                  );
                  return throwError(err);
                }),
              ),
            ),
            tap(result => expect(result).toMatchSnapshot('Cleanup')),
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
