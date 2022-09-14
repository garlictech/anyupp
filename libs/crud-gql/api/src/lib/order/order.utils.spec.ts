import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
  calculateOrderSumPriceRounded,
  calculateTaxSumFromBrutto,
} from './order.utils';
import {
  OrderItem,
  OrderItemConfigComponentInput,
  OrderItemConfigSetInput,
  OrderItemInput,
  PriceShown,
  ProductComponentSetType,
} from '@bgap/domain';

const orderItemConfigSetBase: Pick<
  OrderItemConfigSetInput,
  'productSetId' | 'name' | 'type'
> = {
  productSetId: 'PRODUCTSET_ID',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
  type: ProductComponentSetType.modifier,
};
const orderItemConfigComponentBase: Pick<
  OrderItemConfigComponentInput,
  'productComponentId' | 'name'
> = {
  productComponentId: 'PRODUCT_COMPONENT_ID',
  name: { en: 'EN_NAME', de: 'DE_NAME', hu: 'HU_NAME' },
};
/** priceSum of the config set is  +0.88*/
const orderItemConfigSet_01: OrderItemConfigSetInput = {
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
const orderItemConfigSet_02: OrderItemConfigSetInput = {
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

const orderItemFixture: OrderItem = {
  productId: 'PRODUCT_ID',
  statusLog: [],
  productName: {
    en: 'PRODUCT_NAME',
  },
  sumPriceShown: {
    currency: 'EUR',
    pricePerUnit: 10,
    tax: 10,
    priceSum: 11,
    taxSum: 1,
  },
  variantId: 'VARIANT_ID',
  variantName: { en: 'VARIANT_NAME' },
  quantity: 1,
  priceShown: {
    currency: 'EUR',
    pricePerUnit: 10,
    priceSum: 0,
    tax: 0,
    taxSum: 0,
  },
};

describe('calculateTaxSumFromBrutto method', () => {
  it('should calculate the correct taxSum from tax and brutto inputs', () => {
    expect(calculateTaxSumFromBrutto({ tax: 0, brutto: 10 })).toEqual(0);
    expect(calculateTaxSumFromBrutto({ tax: 10, brutto: 11 })).toEqual(1);
    expect(calculateTaxSumFromBrutto({ tax: 5, brutto: 10 })).toEqual(
      0.47619047619047616,
    );
    expect(calculateTaxSumFromBrutto({ tax: 27, brutto: 10 })).toEqual(
      2.125984251968504,
    );
  });
});

describe('calculateOrderItemPriceRounded method', () => {
  const item: OrderItem = {
    productId: 'PRODUCT_ID',
    statusLog: [],
    productName: {
      en: 'PRODUCT_NAME',
    },
    sumPriceShown: {
      currency: 'EUR',
      pricePerUnit: 10,
      tax: 10,
      priceSum: 11,
      taxSum: 1,
    },
    variantId: 'VARIANT_ID',
    variantName: { en: 'VARIANT_NAME' },
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
    expect(calculateOrderItemPriceRounded(item)).toEqual({
      ...item.priceShown,
      priceSum: 10,
    });
  });
  it('should use the quantity to calculate the priceSum', () => {
    const priceShown: PriceShown = {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 0,
      taxSum: 0,
    };
    expect(
      calculateOrderItemPriceRounded({
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
    const priceShown: PriceShown = {
      currency: 'EUR',
      pricePerUnit: 10,
      priceSum: 0,
      tax: 25,
      taxSum: 0,
    };
    const quantity = 2;
    const result = calculateOrderItemPriceRounded({
      ...item,
      priceShown,
      quantity,
    });
    expect(result.priceSum).toEqual(priceShown.pricePerUnit * quantity); // 20
    expect(result.taxSum).toEqual(4); // 0.25 ÷ 1.25 * 10 = 2  => 2* quantity = 4
    const result02 = calculateOrderItemPriceRounded({
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
  const item: OrderItem = {
    ...orderItemFixture,
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
    expect(calculateOrderItemSumPriceRounded(item)).toEqual({
      ...item.priceShown,
      pricePerUnit: 14.88,
      priceSum: 44.64, // (10+4+0.88)*3
      taxSum: 4.06,
    });
  });
});

describe('calculateOrderSumPriceRounded function', () => {
  it('should summarize all the items prices and round only at the end', () => {
    const orderItem_01: OrderItemInput = {
      // PriceSum: 2, TaxSum: 0.01980198019
      ...orderItemFixture,
    };
    const orderItem_02: OrderItemInput = {
      // PriceSum: 0.125, TaxSum: 0.00595238095
      ...orderItemFixture,
      quantity: 1,
      priceShown: {
        currency: 'EUR',
        pricePerUnit: 0.125,
        priceSum: 0,
        tax: 5,
        taxSum: 0,
      },
    };
    const input: OrderItemInput[] = [
      orderItem_01,
      orderItem_02,
      orderItem_02,
      orderItem_02,
      orderItem_02,
    ];
    const result = calculateOrderSumPriceRounded(input);
    expect(result.tax).toEqual(0); // There is no summariezed tax percent because the tax can be different for every items
    expect(result.pricePerUnit).toEqual(0); // There is no summariezed pricePerUnit
    expect(result.currency).toEqual(orderItem_01.priceShown.currency);
    expect(result.taxSum).toMatchSnapshot('expectedTaxSum');
    expect(result.priceSum).toMatchSnapshot('priceSum');
  });
  it('should summarize all the items with all the config sets', () => {
    const orderItem_01: OrderItemInput = {
      ...orderItemFixture,
    };
    const orderItem_02: OrderItemInput = {
      ...orderItemFixture,
      configSets: [orderItemConfigSet_01], // PriceSum: 3.76 (2 * (1 + 0.88)), TaxSum: 0.0372277...
    };
    const orderItem_03: OrderItemInput = {
      ...orderItemFixture,
      configSets: [orderItemConfigSet_01, orderItemConfigSet_02], // PriceSum: 11.76 (2 * (1 + 0.88 + 4)), TaxSum: 0.11643...
    };
    const input: OrderItemInput[] = [orderItem_01, orderItem_02, orderItem_03];
    const result = calculateOrderSumPriceRounded(input);
    expect(result.priceSum).toEqual(35.76);
    expect(result.taxSum).toMatchSnapshot('taxSum');
  });
});
