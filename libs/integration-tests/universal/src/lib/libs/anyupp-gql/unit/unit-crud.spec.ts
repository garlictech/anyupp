import { filterNullish } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import bcrypt from 'bcryptjs';
import { switchMap, tap } from 'rxjs/operators';
import { unitFixture } from '@bgap/shared/fixtures';
import { createIamCrudSdk } from '../../../../api-clients';
import {
  anyuppResolverHandler,
  createUnitResolver,
  createUnitsDeps,
  updateUnitResolver,
} from '@bgap/anyupp-gql/backend';

describe('Test unit CRUD operations', () => {
  const crudSdk = createIamCrudSdk();

  test.only('Unit shoud be able to CRUD', done => {
    crudSdk
      .DeleteUnit({ input: { id: unitFixture.createUnit_01.id } })
      .pipe(
        switchMap(() =>
          crudSdk.CreateUnit({ input: unitFixture.createUnit_01 }),
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
  });

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
  });

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
    expect(res).toMatchSnapshot({
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  test('The resolver must hash the rkeeper passwords', done => {
    crudSdk
      .DeleteUnit({ input: { id: unitFixture.createRkeeperUnit.id } })
      .pipe(
        switchMap(() =>
          crudSdk.CreateUnit({ input: unitFixture.createRkeeperUnit }),
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
        switchMap(() =>
          crudSdk.GetUnit({ id: unitFixture.createRkeeperUnit.id }),
        ),
        filterNullish<CrudApi.Unit>(),
        tap(async (x: CrudApi.Unit) => {
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'READ',
          );

          expect(
            await bcrypt.compare(
              x?.pos?.rkeeper?.rkeeperPassword as string,
              unitFixture.createRkeeperUnit.pos!.rkeeper!.rkeeperPassword!,
            ),
          ).toEqual(true);

          expect(
            await bcrypt.compare(
              x?.pos?.rkeeper?.anyuppPassword as string,
              unitFixture.createRkeeperUnit.pos!.rkeeper!.anyuppPassword!,
            ),
          ).toEqual(true);
        }),
        switchMap(() =>
          crudSdk.UpdateUnit({
            input: {
              id: unitFixture.createRkeeperUnit.id,
              pos: {
                // This is a fixture, so we set it so
                ...unitFixture.createRkeeperUnit.pos!,
                rkeeper: {
                  // This is a fixture, so we set it so
                  ...unitFixture.createRkeeperUnit.pos!.rkeeper!,
                  rkeeperPassword: 'UPDATED_RKEEPER_PASSWORD',
                  anyuppPassword: 'UPDATED_ANYUPP_PASSWORD',
                },
              },
            },
          }),
        ),
        filterNullish<CrudApi.Unit>(),
        tap(async (x: CrudApi.Unit) => {
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'UPDATE',
          );
          expect(
            await bcrypt.compare(
              'UPDATED_RKEEPER_PASSWORD',
              x?.pos?.rkeeper?.anyuppPassword as string,
            ),
          ).toEqual(true);

          expect(
            await bcrypt.compare(
              'UPDATED_ANYUPP_PASSWORD',
              unitFixture.createRkeeperUnit.pos!.rkeeper!.anyuppPassword!,
            ),
          ).toEqual(true);
        }),
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
  });
});
