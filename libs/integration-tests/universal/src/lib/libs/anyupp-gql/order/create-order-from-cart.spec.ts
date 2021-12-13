import { getCognitoUsername } from '@bgap/shared/fixtures';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  cartFixture,
  groupFixture,
  productFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitFixture,
} from '@bgap/shared/fixtures';
import { EProductType, RequiredId } from '@bgap/shared/types';
import {
  filterNullish,
  throwIfEmptyValue,
  toFixed2Number,
} from '@bgap/shared/utils';
import { combineLatest, defer } from 'rxjs';
import { delay, switchMap, tap, throwIfEmpty } from 'rxjs/operators';
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
  id: `${testIdPrefix}${TEST_NAME}unitProduct_01`,
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
const cart_05_takeaway: RequiredId<CrudApi.CreateCartInput> = {
  ...cartFixture.cart_01,
  id: `${testIdPrefix}cart_5_id`,
  unitId: unitFixture.unit_01.id,
  servingMode: CrudApi.ServingMode.takeaway,
  items: [{ ...cartFixture.getOrderItem(), productId: unitProduct_01.id }],
};

describe('CreatCartFromOrder mutation test', () => {
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
      deleteTestUnit(unitFixture.unit_01.id, crudSdk),
      deleteTestGroup(groupFixture.group_01.id, crudSdk),
      deleteTestUnitProduct(unitProduct_01.id, crudSdk),
      deleteTestGroupProduct(groupProduct_01.id, crudSdk),
      deleteTestChainProduct(chainProduct_01.id, crudSdk),
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
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestGroup(groupFixture.group_01, crudSdk),
            createTestUnit(unitFixture.createUnit_01, crudSdk),
            createTestChainProduct(chainProduct_01, crudSdk),
            createTestGroupProduct(groupProduct_01, crudSdk),
            createTestUnitProduct(unitProduct_01, crudSdk),
            createTestCart(cart_01, crudSdk),
            createTestCart(cart_02, crudSdk),
            createTestCart(cart_03_different_user, crudSdk),
            createTestCart(cart_04_different_unit, crudSdk),
            createTestCart(cart_05_takeaway, crudSdk),
          ]),
        ),
        delay(5000),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  describe('Test resolver functions', () => {
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
      userId: string,
    ) => {
      const unitId = cart_01.unitId;
      const input = { id: cart_01.id };

      // Cut the long stream to cope with the max 9 op limit
      const calc1 = op(input).pipe(
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
            expect(order).not.toBeNull();
            expect(order.userId).toEqual(userId);
            expect(order.unitId).toEqual(unitId);
            expect(order.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}01`,
            );
            expect(order.archived).toEqual(false);
            // Serving and OrderMode checks
            expect(order.orderMode).toEqual(CrudApi.OrderMode.instant);
            expect(order.servingMode).toEqual(CrudApi.ServingMode.inplace);

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
      );
      // *********************************
      // Secound ORDER with 02 as orderNum
      return calc1.pipe(
        switchMap(() => {
          const input = { id: cart_02.id };
          return op(input);
        }),
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
    };

    it.only('should create an order from a valid cart with resolver function', done => {
      const userId = cart_01.userId;

      testLogic(
        input =>
          defer(() =>
            orderRequestHandler({ crudSdk, userId }).createOrderFromCart({
              input,
            }),
          ),
        userId,
      ).subscribe(() => done());
    }, 30000);

    it('should create an order from a valid cart with server', done => {
      const userId = cart_01.userId;

      testLogic(
        input => authAnyuppSdk.CreateOrderFromCart({ input }),
        userId,
      ).subscribe(() => done());
    }, 30000);

    it('should create an order from a valid cart with old API server', done => {
      const userId = cart_01.userId;

      testLogic(
        input => authOldAnyuppSdk.CreateOrderFromCart({ input }),
        userId,
      ).subscribe(() => done());
    }, 30000);

    it('should create a takeaway order from a takeaway cart', done => {
      const theCart = cart_05_takeaway;
      const userId = theCart.userId;
      const unitId = theCart.unitId;
      const input = { id: theCart.id };

      defer(() =>
        orderRequestHandler({ crudSdk, userId }).createOrderFromCart({ input }),
      )
        .pipe(
          // check order has been truly created
          filterNullish<string>(),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(newOrderId =>
            combineLatest([
              getOrder(crudSdk, newOrderId),
              getCart(crudSdk, theCart.id),
            ]),
          ),

          tap({
            next([order, cart]) {
              expect(order).not.toBeNull();
              expect(order.userId).toEqual(userId);
              expect(order.unitId).toEqual(unitId);

              // Serving and OrderMode checks
              expect(order.orderMode).toEqual(CrudApi.OrderMode.instant);
              expect(order.servingMode).toEqual(CrudApi.ServingMode.takeaway);
              // Items cheks
              expect(order.items[0]).not.toBeNull();
              expect(order.items[0].priceShown.tax).toEqual(
                groupProduct_01.takeawayTax,
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
  });

  describe('Test resolvers on server', () => {
    it("should fail in case the cart is not the user's", done => {
      const cartId = cart_03_different_user.id;
      const input = { id: cartId };
      authAnyuppSdk.CreateOrderFromCart({ input }).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should fail without a unit', done => {
      const cartId = cart_04_different_unit.id;
      const input = { id: cartId };

      authAnyuppSdk.CreateOrderFromCart({ input }).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should fail without a cart', done => {
      const input = { id: cartFixture.cartId_NotExisting };

      authAnyuppSdk.CreateOrderFromCart({ input }).subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
    }, 15000);

    it('should create an order from a valid cart', done => {
      const userId = cart_01.userId;
      const unitId = cart_01.unitId;
      const input = { id: cart_01.id };

      authAnyuppSdk
        .CreateOrderFromCart({ input })
        .pipe(
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
              expect(order).not.toBeNull();
              expect(order.userId).toEqual(userId);
              expect(order.unitId).toEqual(unitId);
              expect(order.orderNum).toEqual(
                `${cart_01.place?.table}${cart_01.place?.seat}01`,
              );
              expect(order.archived).toEqual(false);
              // Serving and OrderMode checks
              expect(order.orderMode).toEqual(CrudApi.OrderMode.instant);
              expect(order.servingMode).toEqual(CrudApi.ServingMode.inplace);

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
            return authAnyuppSdk.CreateOrderFromCart({ input });
          }),
          delay(1000),
          throwIfEmptyValue(),
          switchMap(newOrderId =>
            combineLatest([
              getOrder(crudSdk, newOrderId),
              getCart(crudSdk, cart_02.id),
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

    it('should create a takeaway order from a takeaway cart', done => {
      const theCart = cart_05_takeaway;
      const userId = theCart.userId;
      const unitId = theCart.unitId;
      const input = { id: theCart.id };

      authAnyuppSdk
        .CreateOrderFromCart({ input })
        .pipe(
          // check order has been truly created
          filterNullish<string>(),
          delay(DYNAMODB_OPERATION_DELAY),
          switchMap(newOrderId =>
            combineLatest([
              getOrder(crudSdk, newOrderId),
              getCart(crudSdk, theCart.id),
            ]),
          ),

          tap({
            next([order, cart]) {
              expect(order).not.toBeNull();
              expect(order.userId).toEqual(userId);
              expect(order.unitId).toEqual(unitId);

              // Serving and OrderMode checks
              expect(order.orderMode).toEqual(CrudApi.OrderMode.instant);
              expect(order.servingMode).toEqual(CrudApi.ServingMode.takeaway);
              // Items cheks
              expect(order.items[0]).not.toBeNull();
              expect(order.items[0].priceShown.tax).toEqual(
                groupProduct_01.takeawayTax,
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
  });
});
