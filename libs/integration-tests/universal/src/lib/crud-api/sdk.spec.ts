import {
  AmplifySdk,
  fromApolloSubscription,
  getCrudSdkForIAM,
  OnAdminUserChangeSubscription,
} from '@bgap/crud-gql/api';
import { from, interval, of } from 'rxjs';
import { switchMap, switchMapTo, take, takeUntil, tap } from 'rxjs/operators';

describe('CRUD sdk test', () => {
  let sdk: AmplifySdk;

  beforeAll(() => {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    sdk = getCrudSdkForIAM(accessKeyId, secretAccessKey);
  });

  test('An arbitrary CRUD', done => {
    const id = 'CRUD_SDK_ID';

    const toMatchSnapshot = (x: Record<string, unknown>, name: string) =>
      expect(x).toMatchSnapshot(
        {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        name,
      );

    of(1)
      .pipe(
        switchMap(() => from(sdk.DeleteFavoriteProduct({ input: { id } }))),
        switchMap(() =>
          from(sdk.GetFavoriteProduct({ id }, { fetchPolicy: 'no-cache' })),
        ),
        tap(x => expect(x).toMatchSnapshot('SHOULD BE NULL')),
        switchMap(() =>
          from(
            sdk.CreateFavoriteProduct({
              input: { id, userId: 'USER_FOO', unitId: 'UNIT_BAR' },
            }),
          ),
        ),
        tap(x => toMatchSnapshot(x, 'CREATE')),
        switchMap(() =>
          from(sdk.GetFavoriteProduct({ id }, { fetchPolicy: 'no-cache' })),
        ),
        tap(x => toMatchSnapshot(x, 'READ')),
        switchMap(() =>
          from(
            sdk.UpdateFavoriteProduct({
              input: { id, userId: 'UPDATED_USER' },
            }),
          ),
        ),
        tap(x => toMatchSnapshot(x, 'UPDATE')),
        switchMap(() => from(sdk.DeleteFavoriteProduct({ input: { id } }))),
        tap(x => toMatchSnapshot(x, 'DELETE')),
        switchMap(() =>
          from(sdk.GetFavoriteProduct({ id }, { fetchPolicy: 'no-cache' })),
        ),
        tap(x =>
          expect(x).toMatchSnapshot('READ AFTER DELETE - SHOULD BE NULL'),
        ),
      )
      .subscribe(() => done());
  }, 5000);

  test('An arbitrary subscription', done => {
    const id = 'ADMIN_USERCRUD_SDK_ID';
    const dataSource$ = sdk.OnAdminUserChange({ id });

    const subs$ = fromApolloSubscription<OnAdminUserChangeSubscription>(
      dataSource$,
    ).pipe(
      tap(result => {
        expect(result).toMatchSnapshot();
      }),
      take(1),
    );

    const subsSubs = subs$.subscribe();

    of(1)
      .pipe(
        switchMap(() => from(sdk.DeleteAdminUser({ input: { id } }))),
        switchMap(() =>
          from(
            sdk.CreateAdminUser({
              input: { id, name: 'NAME', phone: 'phone', email: 'a@a.hu' },
            }),
          ),
        ),
        switchMapTo(interval(1000)),
        takeUntil(subs$),
        switchMap(() =>
          from(
            sdk.UpdateAdminUser({
              input: { id, name: 'NAME2', email: 'a@a.hu' },
            }),
          ),
        ),
      )
      .subscribe({
        complete: () => {
          subsSubs.unsubscribe();
          done();
        },
      });
  }, 10000);
});
