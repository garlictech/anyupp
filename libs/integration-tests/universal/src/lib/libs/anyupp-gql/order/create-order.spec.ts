import axios from 'axios';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import { DynamoDB } from 'aws-sdk';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  maskAll,
  rkeeperEndpoint,
  yellowRkeeperPassword,
  yellowRkeeperUsername,
  yellowRestaurantId,
} from '@bgap/shared/fixtures';
import {
  delay,
  switchMap,
  switchMapTo,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import { defer, forkJoin, of } from 'rxjs';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import { orderRequestHandler } from '@bgap/backend/orders';
import * as rkeeperApi from '@bgap/rkeeper-api';
import * as R from 'ramda';

// See:https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-968853688
jest.mock('@bgap/rkeeper-api', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('@bgap/rkeeper-api'),
}));

const orderItemInput: CrudApi.OrderItemInput = {
  quantity: 5,
  productId: 'PRODUCT ID',
  statusLog: [
    {
      userId: 'test-monad',
      status: CrudApi.OrderStatus.none,
      ts: 1627909024677,
    },
  ],
  sumPriceShown: {
    taxSum: 316.98,
    currency: 'HUF',
    tax: 27,
    priceSum: 1491,
    pricePerUnit: 298.2,
  },
  productName: { en: 'Product name' },
  laneId: `lane_01`,
  priceShown: {
    taxSum: 318.9,
    currency: 'HUF',
    tax: 27,
    priceSum: 1500,
    pricePerUnit: 300,
  },
  variantId: 'VARIANT ID',
  variantName: {
    en: 'VARIANT NAME',
  },
  configSets: [
    {
      name: {
        de: null as string | null,
        en: 'Modifier comp set',
        hu: 'Módosító komponens set',
      },
      type: 'modifier',
      items: [
        {
          productComponentId: `${testIdPrefix}product_component_id`,
          name: {
            de: 'Room temperature',
            en: 'Room temperature',
            hu: 'Szobahőmérsékletű',
          },
          price: -1.7999999999999998,
          allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.gluten],
        },
      ],
      productSetId: `${testIdPrefix}product_component_set_id`,
    },
  ],
  productType: 'drink',
};

const getId = (num: Number) =>
  `create-order-${num}-8123c8c8-a09a-11ec-b909-0242ac120002`;

const orderInput: Omit<CrudApi.CreateOrderInput, 'unitId'> = {
  userId: 'test-monad',
  items: [orderItemInput],
  sumPriceShown: {
    taxSum: 633.96,
    currency: 'HUF',
    tax: 27,
    priceSum: 2982,
    pricePerUnit: 298.2,
  },
  takeAway: false,
  place: {
    table: '01',
    seat: '01',
  },
  orderMode: CrudApi.OrderMode.instant,
  servingMode: CrudApi.ServingMode.inplace,
  hasRated: true,
  rating: {
    key: 'RATING KEY',
    value: 3,
  },
  serviceFee: {
    currency: 'HUF',
    grossPrice: 200,
    taxContent: 20,
  },
  paymentMode: {
    method: CrudApi.PaymentMethod.cash,
    type: CrudApi.PaymentType.card,
  },
};

const unitNoRkeeper: CrudApi.CreateUnitInput = {
  id: `createorder-unitnorkeeper-8123c8c8-a09a-11ec-b909-0242ac120002`,
  isActive: true,
  isAcceptingOrders: true,
  name: `Order test unit`,
  address: {
    address: 'Ág u. 1.',
    city: 'Budapest',
    country: 'Magyarország',
    title: 'HQ',
    postalCode: '1021',
  },
  orderPaymentPolicy: CrudApi.OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
    },
  ],
  supportedOrderModes: [CrudApi.OrderMode.instant],
  supportedServingModes: [
    CrudApi.ServingMode.inplace,
    CrudApi.ServingMode.takeaway,
  ],
  groupId: 'foobar',
  chainId: 'foobar',
  location: {
    lat: 47,
    lon: 19,
  },
};

const unitWithRkeeper: CrudApi.CreateUnitInput = {
  ...unitNoRkeeper,
  id: `createorder-unitwithrkeeoer-8123c8c8-a09a-11ec-b909-0242ac120002`,
  externalId: yellowRestaurantId,
  pos: {
    type: CrudApi.PosType.rkeeper,
    rkeeper: {
      // let's use the yellow real rkeeper endpoint
      endpointUri: rkeeperEndpoint,
      rkeeperUsername: yellowRkeeperUsername,
      rkeeperPassword: yellowRkeeperPassword,
      anyuppUsername: 'ANYUPP_USERNAME',
      anyuppPassword: 'ANYUPP_PASSWORD',
    },
  },
};

describe('CreateOrder mutation test', () => {
  let authAnyuppSdk: CrudSdk;
  const crudSdk = createIamCrudSdk();

  const cleanupEach$ = forkJoin([
    // check the getId-s in the test, ensure, that they cover the range here
    ...R.range(1, 3).map(x => crudSdk.DeleteOrder({ input: { id: getId(x) } })),
  ]);

  const cleanupAll$ = forkJoin([
    deleteTestUnit(unitNoRkeeper.id ?? 'badhappened', crudSdk),
    deleteTestUnit(unitWithRkeeper.id ?? 'badhappened', crudSdk),
  ]);

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x;
        }),
        switchMapTo(cleanupAll$),
        switchMapTo(
          forkJoin([
            createTestUnit(unitNoRkeeper, crudSdk),
            createTestUnit(unitWithRkeeper, crudSdk),
          ]),
        ),
      )
      .subscribe(() => done());
  }, 10000);

  beforeEach(done => {
    cleanupEach$.pipe(delay(3000)).subscribe(() => done());
  }, 10000);

  afterAll(done => {
    forkJoin([cleanupAll$, cleanupEach$]).subscribe(() => done());
  }, 10000);

  const testLogic = (
    op: (
      input: CrudApi.CreateOrderInput,
    ) => ReturnType<CrudApi.CrudSdk['CreateOrder']>,
  ) => {
    const funcSpy = jest.fn().mockReturnValue(of({}));
    const rkeeperSpy = jest
      .spyOn(rkeeperApi, 'sendRkeeperOrder')
      .mockReturnValue(funcSpy);

    // Cut the long stream to cope with the max 9 op limit

    const normalOrder = op({
      ...orderInput,
      id: getId(1),
      unitId: unitNoRkeeper.id ?? 'badhappened',
    }).pipe(
      tap(order => expect(maskAll(order)).toMatchSnapshot('Order content')),
    );

    // Secound ORDER with 02 as orderNum
    const secondOrder = normalOrder.pipe(
      switchMap(() =>
        op({
          ...orderInput,
          id: getId(2),
          unitId: unitNoRkeeper.id ?? 'badhappened',
        }),
      ),
      tap(order => {
        expect(order?.orderNum).toMatchSnapshot('second order ordernum');
        expect(rkeeperSpy).not.toHaveBeenCalled();
      }),
      tap(() => expect(rkeeperSpy).not.toHaveBeenCalled()),
      throwIfEmpty(),
    );

    const rkeeperOrder = secondOrder.pipe(
      switchMap(() =>
        op({
          ...orderInput,
          id: getId(3),
          unitId: unitWithRkeeper.id ?? 'badhappened',
        }),
      ),

      tap(() => {
        expect(rkeeperSpy.mock.calls).toMatchSnapshot('rkeeper deps called');
        expect(maskAll(funcSpy.mock.calls)).toMatchSnapshot(
          'rkeeper func called',
        );
      }),
    );

    return rkeeperOrder;
  };

  it('should create an order with resolver function', done => {
    const docClient = new DynamoDB.DocumentClient();

    testLogic(input =>
      defer(() =>
        orderRequestHandler({
          crudSdk,
          orderTableName: tableConfig.Order.TableName,
          unitTableName: tableConfig.Unit.TableName,
          currentTimeISOString: () => new Date().toISOString(),
          random: Math.random,
          axiosInstance: axios,
          uuid: () => uuidV1(),
          docClient,
          userId: 'USER ID',
        }).createOrder({
          input,
        }),
      ),
    ).subscribe(() => done());
  }, 30000);

  it('should create an order with server', done => {
    testLogic(input => authAnyuppSdk.CreateOrder({ input })).subscribe(() =>
      done(),
    );
  }, 30000);
});
