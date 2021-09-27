import { AnyuppSdk } from '@bgap/anyupp-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  cartFixture,
  groupFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { EProductType, RequiredId } from '@bgap/shared/types';
import {
  filterNullish,
  toFixed2Number,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import { combineLatest, defer, iif } from 'rxjs';
import { delay, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import { createTestGroup, deleteTestGroup } from '../../../seeds/group';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';

const DEBUG_MODE_TEST_WITH_LOCALE_CODE = false;

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

const cart_01: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_1_id`,
  unitId: unitFixture.unit_01.id,
  userId: 'WILL BE THE AUTHENTICATED USERID',
  items: [
    cartFixture.getOrderItem(), // Price 1 * 2
    {
      ...cartFixture.getOrderItem(),
      configSets: [orderItemConfigSet_01], // Price (1 -1.5 + 2.3) * 2
    },
    {
      ...cartFixture.getOrderItem(),
      configSets: [orderItemConfigSet_01, orderItemConfigSet_02], // Price (1 + (-1.5 + 2.3) + (5 + -1)) * 2
    },
  ],
};

const orderItemPrice_01 = 2; // brutto - has NO config sets
const orderItemPricePerUnit_02 = 1.8; // brutto - with config sets
const orderItemPrice_02 = 3.6; // brutto - with config sets
const orderItemPricePerUnit_03 = 5.8; // brutto - with config sets
const orderItemPrice_03 = 11.6; // brutto - with config sets

const orderItemTax_01 = 0.425196; // with - has NO config sets
const orderItemTax_02 = 0.7653528; // with config sets
const orderItemTax_03 = 2.4661368; // with config sets

const cart_02: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_2_id`,
  unitId: unitFixture.unit_01.id,
  userId: 'WILL BE THE AUTHENTICATED USERID',
  place: {
    seat: 'SEAT_02',
    table: 'TABLE_02',
  },
};
const cart_03_different_user: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_3_id`,
  unitId: unitFixture.unit_01.id,
  userId: 'NOT_the_authenticated_USERID',
};
const cart_04_different_unit: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_4_id`,
  unitId: 'DIFFERENT_UNITID',
  userId: 'WILL BE THE AUTHENTICATED USERID',
};

describe('CreatCartFromOrder mutation test', () => {
  let authAnyuppSdk: AnyuppSdk;
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestCart(cart_01.id, orderDeps.crudSdk),
      deleteTestCart(cart_02.id, orderDeps.crudSdk),
      deleteTestCart(cart_03_different_user.id, orderDeps.crudSdk),
      deleteTestCart(cart_04_different_unit.id, orderDeps.crudSdk),
      deleteTestUnit(unitFixture.unit_01.id, orderDeps.crudSdk),
      deleteTestGroup(groupFixture.group_01.id, orderDeps.crudSdk),
    ]);

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authAnyuppSdk = x.authAnyuppSdk;
          authenticatedUserId = x.userAttributes.id;
          cart_01.userId = authenticatedUserId;
          cart_02.userId = authenticatedUserId;
          cart_04_different_unit.userId = authenticatedUserId;
        }),
        switchMap(cleanup),
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestGroup(groupFixture.group_01, orderDeps.crudSdk),
            createTestUnit(unitFixture.unit_01, orderDeps.crudSdk),
            createTestCart(cart_01, orderDeps.crudSdk),
            createTestCart(cart_02, orderDeps.crudSdk),
            createTestCart(cart_03_different_user, orderDeps.crudSdk),
            createTestCart(cart_04_different_unit, orderDeps.crudSdk),
          ]),
        ),
        delay(3000),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should create an order from a valid cart', done => {
    const userId = cart_01.userId;
    const unitId = cart_01.unitId;
    const input = { id: cart_01.id };

    iif(
      () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
      // To Debug use direct handler call
      defer(() =>
        orderRequestHandler(orderDeps).createOrderFromCart({ userId, input }),
      ),
      authAnyuppSdk.CreateOrderFromCart({ input }),
    )
      .pipe(
        // check order has been truly created
        filterNullish<string>(),
        delay(1000),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(orderDeps.crudSdk, newOrderId),
            getCart(orderDeps.crudSdk, cart_01.id),
          ]),
        ),
        tap({
          next([order, cart]) {
            expect(order).not.toBeNull();
            expect(order.userId).toEqual(userId);
            expect(order.unitId).toEqual(unitId);
            expect(order.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}01`,
            );
            expect(order.archived).toEqual(false);
            // Items cheks
            expect(order.items[0]).not.toBeNull();
            // allergens
            expect(order.items[0].allergens).not.toBeNull();
            expect(order.items[0].allergens).toEqual(
              cart_01.items[0].allergens,
            );
            // ProductType
            expect(order.items[0].productType).not.toBeNull();
            expect(order.items[0].productType).toEqual(EProductType.FOOD);

            // The item.priceShown should NOT contain the configSetPrices
            const priceShownBasicWithoutConfigSet = {
              currency: 'EUR',
              pricePerUnit: 1,
              priceSum: toFixed2Number(orderItemPrice_01),
              tax: 27,
              taxSum: toFixed2Number(orderItemTax_01),
            };
            expect(order.items[0].priceShown).toEqual(
              priceShownBasicWithoutConfigSet,
            );
            expect(order.items[1].priceShown).toEqual(
              priceShownBasicWithoutConfigSet,
            );
            expect(order.items[2].priceShown).toEqual(
              priceShownBasicWithoutConfigSet,
            );

            // SumPriceShown contains the configSets too
            expect(order.items[0].sumPriceShown).toEqual(
              priceShownBasicWithoutConfigSet, // the item 0 has no config sets
            );
            expect(order.items[1].sumPriceShown).toEqual({
              currency: 'EUR',
              pricePerUnit: toFixed2Number(orderItemPricePerUnit_02),
              priceSum: toFixed2Number(orderItemPrice_02),
              tax: 27,
              taxSum: toFixed2Number(orderItemTax_02),
            });
            expect(order.items[2].sumPriceShown).toEqual({
              currency: 'EUR',
              pricePerUnit: toFixed2Number(orderItemPricePerUnit_03),
              priceSum: toFixed2Number(orderItemPrice_03),
              tax: 27,
              taxSum: toFixed2Number(orderItemTax_03),
            });

            // expect(
            //   order.items[0].allergens?.sort(
            //     (a, b) => (a && b && a > b ? 1 : -1), // using sort it will be in the same order all the time
            //   ),
            // ).toMatchSnapshot(
            //   'Should contain all the allergens without duplication',
            // );

            // The 2nd item has a configSet
            expect(order.items[1].configSets).not.toBeNull();
            // That is the same as it was in the CART
            expect(order.items[1].configSets).toEqual(
              cart_01.items[1].configSets,
            );
            expect(order.sumPriceShown).toEqual({
              currency: 'EUR',
              pricePerUnit: 0,
              priceSum: toFixed2Number(
                orderItemPrice_01 + orderItemPrice_02 + orderItemPrice_03,
              ),
              tax: 0,
              taxSum: toFixed2Number(
                orderItemTax_01 + orderItemTax_02 + orderItemTax_03,
              ),
            });

            // Cart should be deleted
            expect(cart).toBeNull();
          },
        }),
        // *********************************
        // Secound ORDER with 02 as orderNum
        switchMap(() => {
          const input = { id: cart_02.id };
          return iif(
            () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
            defer(() =>
              orderRequestHandler(orderDeps).createOrderFromCart({
                userId,
                input,
              }),
            ),
            authAnyuppSdk.CreateOrderFromCart({ input }),
          );
        }),
        delay(1000),
        throwIfEmptyValue(),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(orderDeps.crudSdk, newOrderId),
            getCart(orderDeps.crudSdk, cart_02.id),
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
            done();
          },
        }),
        throwIfEmpty(),
      )
      .subscribe();
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cart_03_different_user.id;
    const userId = 'DIFFERENT_USER';
    const input = { id: cartId };
    iif(
      () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
      defer(() =>
        orderRequestHandler(orderDeps).createOrderFromCart({
          userId,
          input,
        }),
      ),
      authAnyuppSdk.CreateOrderFromCart({ input }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without an authenticated userId', done => {
    defer(() =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orderRequestHandler(orderDeps).createOrderFromCart({} as any),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  });
  it('should fail without an id in input', done => {
    defer(() =>
      orderRequestHandler(orderDeps).createOrderFromCart({
        userId: 'FOO',
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

    iif(
      () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
      defer(() =>
        orderRequestHandler(orderDeps).createOrderFromCart({
          userId,
          input,
        }),
      ),
      authAnyuppSdk.CreateOrderFromCart({ input }),
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

    iif(
      () => DEBUG_MODE_TEST_WITH_LOCALE_CODE,
      defer(() =>
        orderRequestHandler(orderDeps).createOrderFromCart({
          userId,
          input,
        }),
      ),
      authAnyuppSdk.CreateOrderFromCart({ input }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);
});

const getOrder = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk
    .GetOrder({ id }, { fetchPolicy: 'no-cache' })
    .pipe(throwIfEmptyValue<CrudApi.Order>());
};

const getCart = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk.GetCart({ id }, { fetchPolicy: 'no-cache' });
};
