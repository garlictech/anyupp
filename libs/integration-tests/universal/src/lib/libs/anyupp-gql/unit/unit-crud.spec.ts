import { filterNullish } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import bcrypt from 'bcryptjs';
import { catchError, switchMap, tap, delay, take } from 'rxjs/operators';
import { unitFixture } from '@bgap/shared/fixtures';
import { createIamCrudSdk } from '../../../../api-clients';
import { anyuppResolverHandler } from '@bgap/anyupp-gql/backend';
import { of } from 'rxjs';
import {
  createUnitResolver,
  createUnitsDeps,
  updateUnitResolver,
} from '@bgap/backend/units';

describe('Test unit CRUD operations', () => {
  const crudSdk = createIamCrudSdk();

  afterEach(done => {
    crudSdk
      .DeleteUnit({ input: { id: unitFixture.createUnit_01.id } })
      .pipe(catchError(of), delay(1000), take(1))
      .subscribe(() => done());
  });

  test('Unit shoud be able to CRUD on server', done => {
    crudSdk
      .CreateUnit({ input: unitFixture.createUnit_01 })
      .pipe(
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'CREATE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.createUnit_01.id })),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'READ',
          ),
        ),
        switchMap(() =>
          crudSdk.UpdateUnit({
            input: { id: unitFixture.createUnit_01.id, email: 'NEW EMAIL' },
          }),
        ),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'UPDATE',
          ),
        ),
        switchMap(() =>
          crudSdk.DeleteUnit({ input: { id: unitFixture.createUnit_01.id } }),
        ),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'DELETE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.createUnit_01.id })),
        tap(x => expect(x).toMatchSnapshot('RE-READ')),
      )
      .subscribe(() => done());
  }, 60000);

  test('Unit should be able to CRUD with direct resolvers', done => {
    const unitsDeps = createUnitsDeps();

    crudSdk
      .DeleteUnit({ input: { id: unitFixture.createUnit_01.id } })
      .pipe(
        switchMap(() =>
          createUnitResolver(unitsDeps)({ input: unitFixture.createUnit_01 }),
        ),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'CREATE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.createUnit_01.id })),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'READ',
          ),
        ),
        switchMap(() =>
          updateUnitResolver(unitsDeps)({
            input: { id: unitFixture.createUnit_01.id, email: 'NEW EMAIL' },
          }),
        ),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'UPDATE',
          ),
        ),
        switchMap(() =>
          crudSdk.DeleteUnit({ input: { id: unitFixture.createUnit_01.id } }),
        ),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'DELETE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.createUnit_01.id })),
        tap(x => expect(x).toMatchSnapshot('RE-READ')),
      )
      .subscribe(() => done());
  }, 60000);

  test('The resolver handlers must work', async () => {
    process.env.STRIPE_SECRET_KEY = '';

    const res = await anyuppResolverHandler(
      {
        typeName: 'Mutation',
        fieldName: 'updateUnit',
        arguments: { input: { id: 'test_unit_1_id', email: 'NEW EMAIL' } },
      },
      {} as any,
      () => {},
    );
    expect(res).toMatchSnapshot();
  });

  test('The resolver must hash the anyupp passwords for rkeeper units', done => {
    const matcher = {
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      pos: {
        rkeeper: {
          anyuppPassword: expect.any(String),
        },
      },
    };

    crudSdk
      .DeleteUnit({ input: { id: unitFixture.createRkeeperUnit.id } })
      .pipe(
        switchMap(() =>
          crudSdk.CreateUnit({ input: unitFixture.createRkeeperUnit }),
        ),
        tap(x => expect(x).toMatchSnapshot(matcher, 'CREATE')),
        switchMap(() =>
          crudSdk.GetUnit({ id: unitFixture.createRkeeperUnit.id }),
        ),
        filterNullish<CrudApi.Unit>(),
        tap(async (x: CrudApi.Unit) => {
          expect(x).toMatchSnapshot(matcher, 'READ');

          expect(
            await bcrypt.compare(
              unitFixture.createRkeeperUnit.pos!.rkeeper!.anyuppPassword!,
              x?.pos?.rkeeper?.anyuppPassword as string,
            ),
          ).toEqual(true);
        }),
        switchMap(() =>
          crudSdk.UpdateUnitRKeeperData({
            input: {
              unitId: unitFixture.createRkeeperUnit.id,
              ...(unitFixture.createRkeeperUnit?.pos?.rkeeper
                ? unitFixture.createRkeeperUnit.pos.rkeeper
                : {}),
              rkeeperPassword: 'UPDATED_RKEEPER_PASSWORD',
              anyuppPassword: 'UPDATED_ANYUPP_PASSWORD',
            },
          }),
        ),
        filterNullish<CrudApi.Unit>(),
        tap(async (x: CrudApi.Unit) => {
          expect(x).toMatchSnapshot(matcher, 'UPDATE');

          expect(
            await bcrypt.compare(
              'UPDATED_ANYUPP_PASSWORD',
              x?.pos?.rkeeper?.anyuppPassword as string,
            ),
          ).toEqual(true);
        }),
        switchMap(() =>
          crudSdk.DeleteUnit({
            input: { id: unitFixture.createRkeeperUnit.id },
          }),
        ),
        tap(x => expect(x).toMatchSnapshot(matcher, 'DELETE')),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.createUnit_01.id })),
        tap(x => expect(x).toMatchSnapshot('RE-READ')),
      )
      .subscribe(() => done());
  }, 10000);
});
