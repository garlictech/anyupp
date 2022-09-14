import { filterNullish } from '@bgap/shared/utils';

import bcrypt from 'bcryptjs';
import { catchError, switchMap, tap, delay, take } from 'rxjs/operators';
import { createIamCrudSdk } from '../../../../api-clients';
import { anyuppResolverHandler } from '@bgap/anyupp-gql/backend';
import { of } from 'rxjs';
import {
  createUnitResolver,
  createUnitsDeps,
  updateUnitResolver,
} from '@bgap/backend/units';
import {
  OrderMode,
  OrderPaymentPolicy,
  PaymentMethod,
  PaymentType,
  ServingMode,
  Unit,
} from '@bgap/domain';
import { createRkeeperUnit } from '@bgap/shared/fixtures';

const unitFixture = {
  id: 'test-unit-crud',
  isActive: true,
  isAcceptingOrders: true,
  name: `Késdobáló S`,
  packagingTaxPercentage: 27,
  address: {
    address: 'Ág u. 1.',
    city: 'Budapest',
    country: 'Magyarország',
    title: 'HQ',
    postalCode: '1021',
  },
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `Teszt unit`,
    en: `Test unit`,
  },
  orderPaymentPolicy: OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: PaymentMethod.cash,
      type: PaymentType.cash,
    },
    {
      method: PaymentMethod.card,
      type: PaymentType.card,
    },
    {
      method: PaymentMethod.inapp,
      type: PaymentType.stripe,
    },
  ],
  lanes: [
    {
      color: '#e72222',
      id: 'lane_01',
      name: 'bár',
    },
    {
      color: '#e123ef',
      id: 'lane_02',
      name: 'konyha',
    },
  ],
  open: {
    from: '1970-01-01',
    to: '2970-01-01',
  },
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  currency: 'EUR',
  style: {
    colors: {
      backgroundDark: '#d6dde0',
      backgroundLight: '#ffffff',
      borderDark: '#c3cacd',
      borderLight: '#e7e5d0',
      disabled: '#303030',
      indicator: '#30bf60',
      textDark: '#303030',
      textLight: '#ffffff',
      primary: '#30bf60', // indicator
      secondary: '#303030', // textDark
      button: '#30bf60',
      buttonText: '#fffffb',
      icon: '#30bf60',
      highlight: '#30bf60',
    },
  },
};

describe('Test unit CRUD operations', () => {
  const crudSdk = createIamCrudSdk();

  afterEach(done => {
    crudSdk
      .DeleteUnit({ input: { id: unitFixture.id } })
      .pipe(catchError(of), delay(1000), take(1))
      .subscribe(() => done());
  }, 60000);

  test('Unit shoud be able to CRUD on server', done => {
    crudSdk
      .CreateUnit({ input: unitFixture })
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
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.id })),
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
            input: { id: unitFixture.id, email: 'NEW EMAIL' },
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
        switchMap(() => crudSdk.DeleteUnit({ input: { id: unitFixture.id } })),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'DELETE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.id })),
        tap(x => expect(x).toMatchSnapshot('RE-READ')),
      )
      .subscribe(() => done());
  }, 60000);

  test('Unit should be able to CRUD with direct resolvers', done => {
    const unitsDeps = createUnitsDeps();

    crudSdk
      .DeleteUnit({ input: { id: unitFixture.id } })
      .pipe(
        switchMap(() => createUnitResolver(unitsDeps)({ input: unitFixture })),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'CREATE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.id })),
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
            input: { id: unitFixture.id, email: 'NEW EMAIL' },
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
        switchMap(() => crudSdk.DeleteUnit({ input: { id: unitFixture.id } })),
        tap(x =>
          expect(x).toMatchSnapshot(
            {
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            'DELETE',
          ),
        ),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.id })),
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
      .DeleteUnit({ input: { id: createRkeeperUnit.id } })
      .pipe(
        switchMap(() => crudSdk.CreateUnit({ input: createRkeeperUnit })),
        tap(x => expect(x).toMatchSnapshot(matcher, 'CREATE')),
        switchMap(() => crudSdk.GetUnit({ id: createRkeeperUnit.id })),
        filterNullish<Unit>(),
        tap(async (x: Unit) => {
          expect(x).toMatchSnapshot(matcher, 'READ');

          expect(
            await bcrypt.compare(
              createRkeeperUnit.pos!.rkeeper!.anyuppPassword!,
              x?.pos?.rkeeper?.anyuppPassword as string,
            ),
          ).toEqual(true);
        }),
        switchMap(() =>
          crudSdk.UpdateUnitRKeeperData({
            input: {
              unitId: createRkeeperUnit.id,
              ...(createRkeeperUnit?.pos?.rkeeper
                ? createRkeeperUnit.pos.rkeeper
                : {}),
              rkeeperPassword: 'UPDATED_RKEEPER_PASSWORD',
              anyuppPassword: 'UPDATED_ANYUPP_PASSWORD',
            },
          }),
        ),
        filterNullish<Unit>(),
        tap(async (x: Unit) => {
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
            input: { id: createRkeeperUnit.id },
          }),
        ),
        tap(x => expect(x).toMatchSnapshot(matcher, 'DELETE')),
        switchMap(() => crudSdk.GetUnit({ id: unitFixture.id })),
        tap(x => expect(x).toMatchSnapshot('RE-READ')),
      )
      .subscribe(() => done());
  }, 60000);
});
