import { CrudSdk, getCrudSdkForIAM } from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { interval, of } from 'rxjs';
import {
  catchError,
  switchMap,
  switchMapTo,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../api-clients';

describe('CRUD sdk test', () => {
  let sdk: CrudSdk;
  let authSdk: CrudSdk;
  const id = 'TEST_ADMIN_USER';

  beforeAll(async () => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    sdk = getCrudSdkForIAM(accessKeyId, secretAccessKey);
    authSdk = await createAuthenticatedCrudSdk(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();
  });

  afterAll(async () => {
    await sdk.DeleteAdminUser({ input: { id } }).toPromise();
  });

  beforeEach(async () => {
    await sdk.DeleteAdminUser({ input: { id } }).toPromise();
  });

  test('An arbitrary CRUD', done => {
    const toMatchSnapshot = (x: any, name?: string) =>
      expect(x).toMatchSnapshot(
        {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        name,
      );

    sdk
      .DeleteAdminUser({ input: { id } })
      .pipe(
        switchMap(() => sdk.GetAdminUser({ id }, { fetchPolicy: 'no-cache' })),
        tap(x => expect(x).toMatchSnapshot('SHOULD BE NULL')),
        switchMap(() =>
          sdk.CreateAdminUser({
            input: {
              id,
              name: 'NAME',
              phone: '+6234567892',
              email: 'testuser+a1@anyupp.com',
            },
          }),
        ),
        tap(x => toMatchSnapshot(x, 'CREATE')),
        switchMap(() => sdk.GetAdminUser({ id }, { fetchPolicy: 'no-cache' })),
        tap(x => toMatchSnapshot(x, 'READ')),
        switchMap(() =>
          sdk.UpdateAdminUser({
            input: { id, name: 'UPDATED_USER' },
          }),
        ),
        tap(x => toMatchSnapshot(x, 'UPDATE')),
        switchMap(() => sdk.DeleteAdminUser({ input: { id } })),
        tap(x => expect(x).toMatchSnapshot('DELETE')),
        switchMap(() => sdk.GetAdminUser({ id }, { fetchPolicy: 'no-cache' })),
        tap(x =>
          expect(x).toMatchSnapshot('READ AFTER DELETE - SHOULD BE NULL'),
        ),
      )
      .subscribe(() => done());
  }, 60000);

  test('An arbitrary subscription', done => {
    const id = 'ADMIN_USERCRUD_SDK_ID';
    const dataSource$ = authSdk.OnAdminUserChange({ id });

    const subs$ = dataSource$.pipe(
      tap(x =>
        expect(x).toMatchSnapshot({
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ),
      take(1),
    );

    const subsSubs = subs$.subscribe();

    authSdk
      .DeleteAdminUser({ input: { id } })
      .pipe(
        // we swallow the error if we cannot delete the user (probably it does not exist)
        catchError(() => of(true)),
        switchMap(() =>
          authSdk.CreateAdminUser({
            input: {
              id,
              name: 'NAME',
              phone: '+6234567890',
              email: 'testuser+a2@anyupp.com',
            },
          }),
        ),
        switchMapTo(interval(1000)),
        takeUntil(subs$),
        switchMap(() =>
          authSdk.UpdateAdminUser({
            input: { id, name: 'NAME2', email: 'a3@anyupp.com' },
          }),
        ),
      )
      .subscribe({
        complete: async () => {
          subsSubs.unsubscribe();
          await authSdk.DeleteAdminUser({ input: { id } }).toPromise();
          done();
        },
      });
  }, 60000);
});
