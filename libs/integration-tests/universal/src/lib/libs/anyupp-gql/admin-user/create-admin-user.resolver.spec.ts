import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { from, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { createAuthenticatedAnyuppSdk } from '../../../../api-clients';

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
          sdk.DeleteAdminUser({ userName }).pipe(
            catchError((err: Error) => {
              if (err.message.includes('User does not exist')) {
                return of({});
              }
              return throwError(err);
            }),
            switchMap(() =>
              sdk
                .CreateAdminUser({
                  input: {
                    email: 'foobar',
                    name: 'Mekk elek',
                    phone: '12356666',
                  },
                })
                .pipe(
                  catchError(err => {
                    expect(err).toMatchSnapshot('Malformed email error');
                    return of({});
                  }),
                ),
            ),
            switchMap(() =>
              sdk.CreateAdminUser({
                input: {
                  email: userName,
                  name: 'Mekk Elek',
                  phone: '123456',
                },
              }),
            ),
            switchMap(() =>
              sdk
                .CreateAdminUser({
                  input: {
                    email: userName,
                    name: 'Mekk Elek',
                    phone: '123456',
                  },
                })
                .pipe(
                  catchError(err => {
                    expect(err).toMatchSnapshot(
                      'Should not create existing user',
                    );
                    return of({});
                  }),
                ),
            ),
            // Cleanup
            switchMap(() => sdk.DeleteAdminUser({ userName })),
            tap(result => expect(result).toMatchSnapshot('Cleanup')),
          ),
        ),
      )
      .subscribe(() => done());
  }, 20000);
});
