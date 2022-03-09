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
  unitFixture,
  maskAll,
} from '@bgap/shared/fixtures';
import { delay, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
import { defer, forkJoin } from 'rxjs';
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

const orderInput: CrudApi.CreateOrderInput = {
  userId: 'test-monad',
  unitId: unitFixture.unitId_seeded_01,
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
};

describe('CreatOrder mutation test', () => {
  let authAnyuppSdk: CrudSdk;
  const crudSdk = createIamCrudSdk();

  const cleanup = () =>
    forkJoin([
      // CleanUP
      deleteTestUnit(unitFixture.unit_01.id, crudSdk),
      deleteTestUnit(unitFixture.createRkeeperUnit.id, crudSdk),
      ...R.range(1, 1).map(x =>
        crudSdk.DeleteOrder({ input: { id: getId(x) } }),
      ),
    ]);

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x;
        }),
      )
      .subscribe(() => done());
  });

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(1000),
        switchMap(() =>
          // Seeding
          forkJoin([
            createTestUnit(unitFixture.createUnit_01, crudSdk),
            createTestUnit(unitFixture.createRkeeperUnit, crudSdk),
          ]),
        ),
        delay(3000),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  const testLogic = (
    op: (
      input: CrudApi.CreateOrderInput,
    ) => ReturnType<CrudApi.CrudSdk['CreateOrder']>,
  ) => {
    const rkeeperSpy = jest.spyOn(rkeeperApi, 'sendRkeeperOrder');
    // Cut the long stream to cope with the max 9 op limit

    const normalOrder = op(orderInput).pipe(
      tap(order => expect(maskAll(order)).toMatchSnapshot('Order content')),
    );

    // Secound ORDER with 02 as orderNum
    const secondOrder = normalOrder.pipe(
      switchMap(() => op(orderInput)),
      tap(order =>
        expect(order?.orderNum).toMatchSnapshot('second order ordernum'),
      ),
      tap(() => expect(rkeeperSpy).not.toHaveBeenCalled()),
      throwIfEmpty(),
    );

    const rkeeperOrder = secondOrder.pipe(
      switchMap(() =>
        op({
          ...orderInput,
          unitId: unitFixture.createRkeeperUnit.id,
        }),
      ),

      tap(() =>
        expect(rkeeperSpy.mock.calls).toMatchSnapshot('rkeeper called'),
      ),
    );

    return rkeeperOrder;
  };

  it.only('should create an order with resolver function', done => {
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
