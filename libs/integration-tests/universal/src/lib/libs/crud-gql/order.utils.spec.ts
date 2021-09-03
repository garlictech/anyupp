import { of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

import { getDayIntervals, timezoneBudapest } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  cartFixture,
  orderFixture as ofx,
  transactionFixture as tfx,
  unitFixture,
} from '@bgap/shared/fixtures';
import { IDateIntervals } from '@bgap/shared/types';
import { toFixed2Number } from '@bgap/shared/utils';

const TEST_NAME = 'ORDER_UTILS_';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

const orderItemConfigSetBase: Pick<
  CrudApi.OrderItemConfigSetInput,
  'productSetId' | 'name' | 'type'
> = {
  productSetId: 'PRODUCTSET_ID',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
  type: 'TYPE',
};
const orderItemConfigComponentBase: Pick<
  CrudApi.OrderItemConfigComponentInput,
  'productComponentId' | 'name'
> = {
  productComponentId: 'PRODUCT_COMPONENT_ID',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
};
/** priceSum of the config set is  +0.88*/
const orderItemConfigSet_01: CrudApi.OrderItemConfigSetInput = {
  ...orderItemConfigSetBase,
  items: [
    {
      ...orderItemConfigComponentBase,
      price: -1.125,
    },
    {
      ...orderItemConfigComponentBase,
      price: 2.005,
    },
  ],
};
/** priceSum of the config set is +4 */
const orderItemConfigSet_02: CrudApi.OrderItemConfigSetInput = {
  ...orderItemConfigSetBase,
  items: [
    {
      ...orderItemConfigComponentBase,
      price: 5,
    },
    {
      ...orderItemConfigComponentBase,
      price: -1,
    },
  ],
};

describe('calculateTaxSumFromBrutto method', () => {
  it('should calculate the correct taxSum from tax and brutto inputs', () => {
    expect(CrudApi.calculateTaxSumFromBrutto({ tax: 0, brutto: 10 })).toEqual(
      0,
    );
    expect(CrudApi.calculateTaxSumFromBrutto({ tax: 10, brutto: 11 })).toEqual(
      1,
    );
    expect(CrudApi.calculateTaxSumFromBrutto({ tax: 5, brutto: 10 })).toEqual(
      0.47619047619047616,
    );
    expect(CrudApi.calculateTaxSumFromBrutto({ tax: 27, brutto: 10 })).toEqual(
      2.125984251968504,
    );
  });
});

describe('calculateOrderItemPriceRounded method', () => {
  const item: CrudApi.OrderItem = {
    ...cartFixture.getOrderItem(),
    quantity: 1,
    priceShown: {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    },
  };
  it('should return all the given fields without changing the currency, pricePerUnit and tax fields', () => {
    expect(CrudApi.calculateOrderItemPriceRounded(item)).toEqual({
      ...item.priceShown,
      priceSum: 10,
    });
  });
  it('should use the quantity to calculate the priceSum', () => {
    const priceShown: CrudApi.PriceShown = {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    };
    expect(
      CrudApi.calculateOrderItemPriceRounded({
        ...item,
        priceShown,
        quantity: 2,
      }),
    ).toEqual({
      ...priceShown,
      priceSum: 20,
    });
  });
  it('should calculate the proper taxSum', () => {
    const priceShown: CrudApi.PriceShown = {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 25,
      taxSum: 0,
    };
    const quantity = 2;
    const result = CrudApi.calculateOrderItemPriceRounded({
      ...item,
      priceShown,
      quantity,
    });
    expect(result.priceSum).toEqual(priceShown.pricePerUnit * quantity); // 20
    expect(result.taxSum).toEqual(4); // 0.25 ÷ 1.25 * 10 = 2  => 2* quantity = 4
    const result02 = CrudApi.calculateOrderItemPriceRounded({
      ...item,
      priceShown: {
        ...priceShown,
        tax: 27,
      },
      quantity,
    });
    expect(result02.priceSum).toEqual(priceShown.pricePerUnit * quantity);
    expect(result02.taxSum).toEqual(4.25); // result.priceSum * (0.27 / 1.27)
  });
});

describe('calculateOrderItemSumPriceRounded function', () => {
  const item: CrudApi.OrderItem = {
    ...cartFixture.getOrderItem(),
    quantity: 3,
    priceShown: {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 10,
      taxSum: 0,
    },
    configSets: [orderItemConfigSet_01, orderItemConfigSet_02],
  };
  it("should add the summarized confiset prices to the item's price too", () => {
    expect(CrudApi.calculateOrderItemSumPriceRounded(item)).toEqual({
      ...item.priceShown,
      pricePerUnit: 14.88,
      priceSum: 44.64, // (10+4+0.88)*3
      taxSum: 4.06,
    });
  });
});

describe('calculateOrderSumPriceRounded function', () => {
  it('should summarize all the items prices and round only at the end', () => {
    const orderItem_01: CrudApi.OrderItemInput = {
      // PriceSum: 2, TaxSum: 0.01980198019
      ...cartFixture.getOrderItem({ tax: 1 }),
    };
    const orderItemPrice_01 = 2;
    const orderItemTax_01 = 0.01980198019;
    const orderItem_02: CrudApi.OrderItemInput = {
      // PriceSum: 0.125, TaxSum: 0.00595238095
      ...cartFixture.getOrderItem({ tax: 1 }),
      quantity: 1,
      priceShown: {
        currency: 'EUR',
        pricePerUnit: 0.125,
        priceSum: 0,
        tax: 5,
        taxSum: 0,
      },
    };
    const orderItemPrice_02 = 0.125;
    const orderItemTax_02 = 0.00595238095;
    const input: CrudApi.OrderItemInput[] = [
      orderItem_01,
      orderItem_02,
      orderItem_02,
      orderItem_02,
      orderItem_02,
    ];
    const expectedBruttoPriceSum = 4 * orderItemPrice_02 + orderItemPrice_01; // Prices
    const expectedTaxSum = 4 * orderItemTax_02 + orderItemTax_01;
    const result = CrudApi.calculateOrderSumPriceRounded(input);
    expect(result.tax).toEqual(0); // There is no summariezed tax percent because the tax can be different for every items
    expect(result.pricePerUnit).toEqual(0); // There is no summariezed pricePerUnit
    expect(result.currency).toEqual(orderItem_01.priceShown.currency);
    expect(result.taxSum).toEqual(toFixed2Number(expectedTaxSum));
    expect(result.priceSum).toEqual(toFixed2Number(expectedBruttoPriceSum));
  });
  it('should summarize all the items with all the config sets', () => {
    const orderItem_01: CrudApi.OrderItemInput = {
      ...cartFixture.getOrderItem({ tax: 1 }), // PriceSum: 2 * 1, TaxSum: 0.01980...
    };
    const orderItem_02: CrudApi.OrderItemInput = {
      ...cartFixture.getOrderItem({ tax: 1 }),
      configSets: [orderItemConfigSet_01], // PriceSum: 3.76 (2 * (1 + 0.88)), TaxSum: 0.0372277...
    };
    const orderItem_03: CrudApi.OrderItemInput = {
      ...cartFixture.getOrderItem({ tax: 1 }),
      configSets: [orderItemConfigSet_01, orderItemConfigSet_02], // PriceSum: 11.76 (2 * (1 + 0.88 + 4)), TaxSum: 0.11643...
    };
    const input: CrudApi.OrderItemInput[] = [
      orderItem_01,
      orderItem_02,
      orderItem_03,
    ];
    const result = CrudApi.calculateOrderSumPriceRounded(input);
    expect(result.priceSum).toEqual(2 + 3.76 + 11.76);
    expect(result.taxSum).toEqual(0.17); //  0.173459
  });
});

describe('SearchOrders function', () => {
  let crudSdk: CrudApi.CrudSdk;
  const orderId = 'int_test_order_id_1';
  const transactionId = 'int_test_transaction_id_1';

  const cleanup = async () => {
    await crudSdk
      .DeleteOrder({
        input: {
          id: orderId,
        },
      })
      .toPromise();

    await crudSdk
      .DeleteTransaction({
        input: {
          id: transactionId,
        },
      })
      .toPromise();
  };

  beforeAll(async () => {
    crudSdk = CrudApi.getCrudSdkForIAM(accessKeyId, secretAccessKey);

    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  test('Pagination should return with new archived orders', done => {
    const isoDate = new Date().toISOString();
    const dayIntervals: IDateIntervals = getDayIntervals(
      isoDate,
      timezoneBudapest,
    );
    const searchParams = {
      query: {
        filter: {
          unitId: { eq: unitFixture.unitId_seeded_01 },
          archived: { eq: true },
          createdAt: {
            gte: new Date(dayIntervals.from).toISOString(),
            lte: new Date(dayIntervals.to).toISOString(),
          },
        },
      },
      options: { fetchPolicy: 'no-cache' },
    };
    let ordersCount = -1;

    // Get initial list
    of('test')
      .pipe(
        // delay(5000),
        switchMap(() =>
          getAllPaginatedData(crudSdk.SearchOrders, searchParams),
        ),
        map(orderList => {
          ordersCount = orderList.items.length;
          expect(orderList.items.length).toBeGreaterThanOrEqual(0);
        }),
        switchMap(() =>
          crudSdk.CreateTransaction({
            input: {
              ...tfx.successCardTransactionInput,
              id: transactionId,
              orderId,
            },
          }),
        ),
        switchMap(() =>
          crudSdk.CreateOrder({
            input: {
              ...ofx.historySuccessCardOrderInput,
              id: orderId,
              transactionId,
            },
          }),
        ),
        delay(5000),
        switchMap(() =>
          getAllPaginatedData(crudSdk.SearchOrders, searchParams).pipe(
            map(orderList => {
              expect(orderList.items.length).toBe(ordersCount + 1);
            }),
          ),
        ),
      )
      .subscribe({
        next() {
          done();
        },
        error(err) {
          console.error(`${TEST_NAME}Test ERROR`, err);
        },
      });
  }, 20000);
});
