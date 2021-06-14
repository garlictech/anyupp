import { calculatePriceShown, calculateOrderSumPrice } from './order.utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { cartFixture } from '@bgap/shared/fixtures';
import { toFixed2Number } from '../number.utils';
describe('calculatePriceShown method', () => {
  it('should return all the given fields without changing the currency, pricePerUnit and tax fields', () => {
    const priceShown: CrudApi.PriceShown = {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    };
    expect(calculatePriceShown({ ...priceShown, quantity: 1 })).toEqual({
      ...priceShown,
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
    expect(calculatePriceShown({ ...priceShown, quantity: 2 })).toEqual({
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
    const result = calculatePriceShown({ ...priceShown, quantity });
    expect(result.priceSum).toEqual(priceShown.pricePerUnit * quantity); // 20
    expect(result.taxSum).toEqual(4); // 0.25 ÷ 1.25 * 10 = 2  => 2* quantity = 4
    const result02 = calculatePriceShown({
      ...priceShown,
      tax: 27,
      quantity,
    });
    expect(result02.priceSum).toEqual(priceShown.pricePerUnit * quantity);
    expect(result02.taxSum).toEqual(4.251968503937008); // result.priceSum * (0.27 / 1.27)
  });
});
describe('calculateOrderSumPrice function', () => {
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
    const result = calculateOrderSumPrice(input);
    expect(result.tax).toEqual(0); // There is no summariezed tax percent because the tax can be different for every items
    expect(result.pricePerUnit).toEqual(0); // There is no summariezed pricePerUnit
    expect(result.currency).toEqual(orderItem_01.priceShown.currency);
    expect(result.taxSum).toEqual(toFixed2Number(expectedTaxSum));
    expect(result.priceSum).toEqual(toFixed2Number(expectedBruttoPriceSum));
  });
  it('should summarize all the items with all the config sets', () => {
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
    const result = calculateOrderSumPrice(input);
    expect(result.priceSum).toEqual(2 + 3.76 + 11.76);
    expect(result.taxSum).toEqual(0.17); //  0.173459
  });
});
