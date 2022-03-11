import * as CrudApi from '@bgap/crud-gql/api';
import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
} from './order.utils';

const orderItem: CrudApi.OrderItem = {
  externalId: 'EXTERNAL ID',
  laneId: 'LANE ID',
  priceShown: {
    currency: 'BATKA',
    pricePerUnit: 1.111345,
    priceSum: -1,
    tax: 10,
    taxSum: -1,
  },
  productId: 'PRODUCTID 1',
  productName: {
    hu: 'PRODUCT NAME',
  },
  productType: 'PRODUCT TYPE',
  quantity: 10,
  statusLog: [
    {
      status: CrudApi.OrderStatus.none,
      ts: 1645475822198,
      userId: 'USER ID',
    },
  ],
  sumPriceShown: {
    currency: 'BATKA',
    pricePerUnit: -1,
    priceSum: -1,
    tax: -1,
    taxSum: -1,
  },
  variantId: 'VARIANT ID',
  variantName: {
    hu: 'VARIANT NAME',
  },
  configSets: [
    {
      name: {
        en: 'Modifier comp set',
      },
      type: 'modifier',
      items: [
        {
          productComponentId: `product_component_id`,
          name: {
            en: 'Room temperature',
          },
          price: 2.0011232321,
          allergens: [CrudApi.Allergen.egg],
        },
      ],
      productSetId: `product_component_set_id`,
    },
  ],
};

const calculateOrderItemPriceRoundedCases = [
  {
    item: orderItem,
  },
];

test.each(calculateOrderItemPriceRoundedCases)(
  'calculateOrderItemPriceRounded',
  ({ item }) => {
    expect(calculateOrderItemPriceRounded(item)).toMatchSnapshot();
  },
);

test.each(calculateOrderItemPriceRoundedCases)(
  'calculateOrderItemSumPriceRounded',
  ({ item }) => {
    expect(calculateOrderItemSumPriceRounded(item)).toMatchSnapshot();
  },
);
