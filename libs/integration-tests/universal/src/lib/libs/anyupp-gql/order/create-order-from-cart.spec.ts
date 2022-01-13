import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  generatedProductFixture,
  cartFixture,
  groupFixture,
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
  maskAll,
  maskTimestamp,
  maskV4UuidIds,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { filterNullish, throwIfEmptyValue } from '@bgap/shared/utils';
import { combineLatest, defer, of } from 'rxjs';
import {
  catchError,
  delay,
  switchMap,
  tap,
  throwIfEmpty,
} from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import {
  createTestChainProduct,
  deleteTestChainProduct,
} from '../../../seeds/chain-product';
import { createTestGroup, deleteTestGroup } from '../../../seeds/group';
import {
  createTestGroupProduct,
  deleteTestGroupProduct,
} from '../../../seeds/group-product';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import {
  createTestUnitProduct,
  deleteTestUnitProduct,
} from '../../../seeds/unit-product';
import { AnyuppSdk } from '@bgap/anyupp-gql/api';
import { orderRequestHandler } from '@bgap/backend/orders';
import { dateMatcher } from '../../../../utils';
import * as rkeeperApi from '@bgap/rkeeper-api';

// See:https://github.com/aelbore/esbuild-jest/issues/26#issuecomment-968853688
jest.mock('@bgap/rkeeper-api', () => ({
  __esModule: true,
  // @ts-ignore
  ...jest.requireActual('@bgap/rkeeper-api'),
}));

const TEST_NAME = 'ORDER_';
const DYNAMODB_OPERATION_DELAY = 3000;

const getOrder = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk
    .GetOrder({ id }, { fetchPolicy: 'no-cache' })
    .pipe(throwIfEmptyValue<CrudApi.Order>());
};

const getCart = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk.GetCart({ id }, { fetchPolicy: 'no-cache' });
};

// PRODUCTS to create
const chainProduct_01: RequiredId<CrudApi.CreateChainProductInput> = {
  ...productFixture.chainProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}chainProduct_01`,
};
const groupProduct_01: RequiredId<CrudApi.CreateGroupProductInput> = {
  ...productFixture.groupProductInputBase,
  id: `${testIdPrefix}${TEST_NAME}groupProduct_01`,
  parentId: chainProduct_01.id,
  takeawayTax: 53,
};
const unitProduct_01: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: productFixture.unitProductId_seeded_id_01,
  parentId: groupProduct_01.id,
};

const orderItemConfigSet_01: CrudApi.OrderItemConfigSetInput = {
  productSetId: 'PRODUCTSET_ID_01',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
  type: 'TYPE',
  items: [
    {
      productComponentId: 'PRODUCT_COMPONENT_ID_0101',
      name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
      price: -1.5,
      allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.fish],
      netPackagingFee: 1,
    },
    {
      productComponentId: 'PRODUCT_COMPONENT_ID_0102',
      name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
      price: 2.3,
      allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.gluten],
    },
  ],
};

const orderItemConfigSet_02: CrudApi.OrderItemConfigSetInput = {
  productSetId: 'PRODUCTSET_ID_02',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
  type: 'TYPE',
  items: [
    {
      productComponentId: 'PRODUCT_COMPONENT_ID_0201',
      name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
      price: 5,
    },
    {
      productComponentId: 'PRODUCT_COMPONENT_ID_0202',
      name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
      price: -1,
      allergens: [CrudApi.Allergen.peanut],
    },
  ],
};

const unitProductFixture: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...unitProduct_01,
  unitId: unitFixture.unit_01.id,
  chainId: unitFixture.unit_01.chainId,
  groupId: unitFixture.unit_01.groupId,
};

const generatedProduct: RequiredId<CrudApi.CreateGeneratedProductInput> = {
  ...generatedProductFixture.getGeneratedProduct({
    id: unitProductFixture.id,
    unitId: unitProductFixture.unitId,
    productCategoryId: 'NO_PRODUCT_CATEGORY',
  }),

  configSets: [
    {
      ...orderItemConfigSet_01,
      items: orderItemConfigSet_01.items.map(item => ({
        ...item,
        position: 1,
      })),
      position: 1,
    },
    {
      ...orderItemConfigSet_02,
      items: orderItemConfigSet_02.items.map(item => ({
        ...item,
        position: 1,
      })),
      position: 2,
    },
  ], // Price (1 + (-1.5 + 2.3) + (5 + -1)) * 2
};

const orderItemFixture: CrudApi.OrderItem = {
  ...cartFixture.getOrderItem(),
  variantId: generatedProduct.variants[0].id,
  variantName: generatedProduct.variants[0].variantName,
};

const cart_01: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_1_id`,
  unitId: unitFixture.unit_01.id,
  userId: 'WILL BE THE AUTHENTICATED USERID',
  items: [
    orderItemFixture,
    {
      ...orderItemFixture,
      configSets: [orderItemConfigSet_01], // Price (1 -1.5 + 2.3) * 2
    },
    {
      ...orderItemFixture,
      configSets: [orderItemConfigSet_01, orderItemConfigSet_02], // Price (1 + (-1.5 + 2.3) + (5 + -1)) * 2
    },
  ],
};

const cart_02: RequiredId<CrudApi.CreateCartInput> = {
  ...cart_01,
  id: `${testIdPrefix}cart_2_id`,
  place: {
    seat: 'SEAT_02',
    table: 'TABLE_02',
  },
};

const cart_03_different_user: RequiredId<CrudApi.CreateCartInput> = {
  ...cart_01,
  id: `${testIdPrefix}cart_3_id`,
  userId: 'NOT_the_authenticated_USERID',
};

const cart_04_different_unit: RequiredId<CrudApi.CreateCartInput> = {
  ...cart_01,
  id: `${testIdPrefix}cart_4_id`,
  unitId: 'DIFFERENT_UNITID',
};

const cart_05_takeaway: RequiredId<CrudApi.CreateCartInput> = {
  ...cart_01,
  id: `${testIdPrefix}cart_5_id`,
  servingMode: CrudApi.ServingMode.takeaway,
};

const cartWithRkeeperUnit: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}-rkeeper-cart`,
  unitId: unitFixture.createRkeeperUnit.id,
};

const unitWithSimplifiedOrderFlow: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitFixture.createUnit_01,
  id: `${testIdPrefix}-simplified-order-unit`,
  orderPolicy: CrudApi.OrderPolicy.placeonly,
};

const cartWithSimplifiedOrderFlow: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}-simplified-order-flow-cart`,
  unitId: unitWithSimplifiedOrderFlow.id,
};

describe('CreatOrderFromCart mutation test', () => {
  let authAnyuppSdk: CrudSdk;
  let authOldAnyuppSdk: AnyuppSdk;
  let authenticatedUserId = getCognitoUsername(testAdminUsername);
  const crudSdk = createIamCrudSdk();

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestCart(cart_01.id, crudSdk),
      deleteTestCart(cart_02.id, crudSdk),
      deleteTestCart(cart_03_different_user.id, crudSdk),
      deleteTestCart(cart_04_different_unit.id, crudSdk),
      deleteTestCart(cart_05_takeaway.id, crudSdk),
      deleteTestCart(cartWithRkeeperUnit.id, crudSdk),
      deleteTestCart(cartWithSimplifiedOrderFlow.id, crudSdk),
      deleteTestUnit(unitFixture.unit_01.id, crudSdk),
      deleteTestUnit(unitFixture.createRkeeperUnit.id, crudSdk),
      deleteTestUnit(unitWithSimplifiedOrderFlow.id, crudSdk),
      deleteTestGroup(groupFixture.group_01.id, crudSdk),
      deleteTestUnitProduct(unitProductFixture.id, crudSdk),
      deleteTestGroupProduct(groupProduct_01.id, crudSdk),
      deleteTestChainProduct(chainProduct_01.id, crudSdk),
      crudSdk.DeleteGeneratedProduct({ input: { id: generatedProduct.id } }),
    ]);

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x;
          cart_01.userId = authenticatedUserId;
          cart_02.userId = authenticatedUserId;
          cart_04_different_unit.userId = authenticatedUserId;
          cart_05_takeaway.userId = authenticatedUserId;
        }),
        switchMap(() =>
          createAuthenticatedAnyuppSdk(
            testAdminUsername,
            testAdminUserPassword,
          ),
        ),
        tap(sdk => (authOldAnyuppSdk = sdk.authAnyuppSdk)),
      )
      .subscribe(() => done());
  });

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(1000),
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestGroup(groupFixture.group_01, crudSdk),
            createTestUnit(unitFixture.createUnit_01, crudSdk),
            createTestUnit(unitFixture.createRkeeperUnit, crudSdk),
            createTestUnit(unitWithSimplifiedOrderFlow, crudSdk),
            createTestChainProduct(chainProduct_01, crudSdk),
            createTestGroupProduct(groupProduct_01, crudSdk),
            createTestUnitProduct(unitProductFixture, crudSdk),
            createTestCart(cart_01, crudSdk),
            createTestCart(cart_02, crudSdk),
            createTestCart(cart_03_different_user, crudSdk),
            createTestCart(cart_04_different_unit, crudSdk),
            createTestCart(cart_05_takeaway, crudSdk),
            createTestCart(cartWithRkeeperUnit, crudSdk),
            createTestCart(cartWithSimplifiedOrderFlow, crudSdk),
            crudSdk.CreateGeneratedProduct({ input: generatedProduct }),
          ]),
        ),
        delay(5000),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it("should fail in case the cart is not the user's", done => {
    const cartId = cart_03_different_user.id;
    const userId = 'DIFFERENT_USER';
    const input = { id: cartId };

    defer(() =>
      orderRequestHandler({ crudSdk, userId }).createOrderFromCart({
        input,
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without an id in input', done => {
    defer(() =>
      orderRequestHandler({ crudSdk, userId: 'FOO' }).createOrderFromCart({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input: {} as any,
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  });

  it('should fail without a unit', done => {
    const cartId = cart_04_different_unit.id;
    const userId = cart_04_different_unit.userId;
    const input = { id: cartId };

    defer(() =>
      orderRequestHandler({ crudSdk, userId }).createOrderFromCart({
        input,
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without a cart', done => {
    const input = { id: cartFixture.cartId_NotExisting };
    const userId = 'NOT_IMPORTANT';

    defer(() =>
      orderRequestHandler({ crudSdk, userId }).createOrderFromCart({
        input,
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  const testLogic = (
    op: (
      input: CrudApi.CreateOrderFromCartInput,
    ) => ReturnType<CrudApi.CrudSdk['CreateOrderFromCart']>,
  ) => {
    const rkeeperSpy = jest.spyOn(rkeeperApi, 'sendRkeeperOrder');

    // Cut the long stream to cope with the max 9 op limit
    const calc1 = op({ id: cart_01.id }).pipe(
      // check order has been truly created
      filterNullish<string>(),
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(newOrderId =>
        combineLatest([
          getOrder(crudSdk, newOrderId),
          getCart(crudSdk, cart_01.id),
        ]),
      ),
      tap({
        next([order, cart]) {
          expect(maskTimestamp(maskV4UuidIds(order))).toMatchSnapshot(
            dateMatcher,
            'Order content',
          );
          // Cart should be deleted
          expect(cart).toBeNull();
        },
      }),
    );
    // *********************************
    // Secound ORDER with 02 as orderNum
    const secondOrder = calc1.pipe(
      switchMap(() => op({ id: cart_02.id })),
      delay(1000),
      throwIfEmptyValue<string>(),
      switchMap(newOrderId =>
        combineLatest([
          getOrder(crudSdk, newOrderId).pipe(),
          getCart(crudSdk, cart_02.id).pipe(),
        ]),
      ),
      tap({
        next([order, cart]) {
          expect(order).not.toBeNull();
          expect(order?.orderNum).toEqual(
            `${cart_02.place?.table}${cart_02.place?.seat}02`,
          );

          // Cart should be deleted
          expect(cart).toBeNull();
        },
      }),
      throwIfEmpty(),
    );

    const takeawayOrder = secondOrder.pipe(
      switchMap(() => op({ id: cart_05_takeaway.id })),
      // check order has been truly created
      filterNullish<string>(),
      delay(DYNAMODB_OPERATION_DELAY),
      switchMap(newOrderId =>
        combineLatest([
          getOrder(crudSdk, newOrderId),
          getCart(crudSdk, cart_05_takeaway.id),
        ]),
      ),
      tap({
        next([order, cart]) {
          expect(maskTimestamp(maskV4UuidIds(order))).toMatchSnapshot(
            dateMatcher,
            'Takeaway order content',
          );
          // Cart should be deleted
          expect(cart).toBeNull();
        },
      }),
      throwIfEmpty(),
      tap(() => expect(rkeeperSpy).not.toHaveBeenCalled()),
    );

    const errorCases = takeawayOrder.pipe(
      switchMap(() =>
        op({ id: cart_03_different_user.id }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot(
              "fail in case the cart is not the user's",
            );
            return of({});
          }),
        ),
      ),
      switchMap(() =>
        op({ id: cart_04_different_unit.id }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot('fail without a unit');
            return of({});
          }),
        ),
      ),
      switchMap(() =>
        op({ id: cartFixture.cartId_NotExisting }).pipe(
          catchError(err => {
            expect(err).toMatchSnapshot('fail without a cart');
            return of({});
          }),
        ),
      ),
    );

    return errorCases;
  };

  it('should create an order from a valid cart with resolver function', done => {
    testLogic(input =>
      defer(() =>
        orderRequestHandler({
          crudSdk,
          userId: cart_01.userId,
        }).createOrderFromCart({
          input,
        }),
      ),
    ).subscribe(() => done());
  }, 30000);

  it('should create an order from a valid cart with server', done => {
    testLogic(input => authAnyuppSdk.CreateOrderFromCart({ input })).subscribe(
      () => done(),
    );
  }, 30000);

  it('should create an order from a valid cart with old API server', done => {
    testLogic(input =>
      authOldAnyuppSdk.CreateOrderFromCart({ input }),
    ).subscribe(() => done());
  }, 30000);

  test('When creating order from cart, send the order to rkeeper', done => {
    const spy = jest.spyOn(rkeeperApi, 'sendRkeeperOrder');

    defer(() =>
      orderRequestHandler({
        crudSdk,
        userId: cartWithRkeeperUnit.userId,
      }).createOrderFromCart({
        input: { id: cartWithRkeeperUnit.id },
      }),
    )
      .pipe(
        catchError(err => {
          return of({});
        }),
        tap(() => expect(maskAll(spy.mock.calls)).toMatchSnapshot()),
      )
      .subscribe(() => done());
  }, 20000);

  test('When creating order with simplified flow, the order must be archived', done => {
    defer(() =>
      orderRequestHandler({
        crudSdk,
        userId: cartWithSimplifiedOrderFlow.userId,
      }).createOrderFromCart({
        input: { id: cartWithSimplifiedOrderFlow.id },
      }),
    )
      .pipe(
        filterNullish(),
        switchMap(id => crudSdk.GetOrder({ id })),
        filterNullish(),
        tap(order => expect(order.archived).toBe(true)),
        switchMap(order => crudSdk.DeleteOrder({ input: { id: order.id } })),
      )
      .subscribe(() => done(), console.error);
  }, 20000);
});
