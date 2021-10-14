import { switchMap, tap } from 'rxjs/operators';
import { unitFixture } from '@bgap/shared/fixtures';
import { createIamCrudSdk } from '../../../../api-clients';
import {
  anyuppResolverHandler,
  createUnitResolver,
  createUnitsDeps,
  unitRequestHandler,
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
        tap(x => expect(x).toMatchSnapshot('CREATE')),
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
        tap(x => expect(x).toMatchSnapshot('UPDATE')),
        switchMap(() =>
          crudSdk.DeleteUnit({ input: { id: unitFixture.createUnit_01.id } }),
        ),
        tap(x => expect(x).toMatchSnapshot('DELETE')),
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
        tap(x => expect(x).toMatchSnapshot('CREATE')),
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
        tap(x => expect(x).toMatchSnapshot('UPDATE')),
        switchMap(() =>
          crudSdk.DeleteUnit({ input: { id: unitFixture.createUnit_01.id } }),
        ),
        tap(x => expect(x).toMatchSnapshot('DELETE')),
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
    expect(res).toMatchSnapshot();
  });
});
