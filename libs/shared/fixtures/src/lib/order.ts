import * as CrudApi from '@bgap/crud-gql/api';

import { seededIdPrefix, testIdPrefix } from './common';
import { getOrderStatusLog } from './order-utils';
import { productSnapshotFixture } from './product-snapshot';
import { unitFixture } from './unit';

const order_seeded_01_id = `${seededIdPrefix}order_1_id`;

const orderItemInputBase = (
  productFixture: CrudApi.CreateChainProductInput,
) => ({
  quantity: 5,
  productId: productFixture.id || '',
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
  productName: productFixture.name,
  allergens: productFixture.allergens,
  laneId: `lane_01`,
  priceShown: {
    taxSum: 318.9,
    currency: 'HUF',
    tax: 27,
    priceSum: 1500,
    pricePerUnit: 300,
  },
  variantId: productFixture.variants?.[0]?.id || '',
  variantName: productFixture.variants?.[0]?.variantName || {
    en: 'unused',
    hu: 'unused',
    de: 'unused',
  },
  configSets: [
    {
      name: {
        de: null as string | null,
        en: 'Modifier comp set',
        hu: 'Módosító komponens set',
      },
      type: CrudApi.ProductComponentSetType.modifier,
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
  productType: CrudApi.ProductType.drink,
});

const orderInputBase = {
  userId: 'test-monad',
  unitId: unitFixture.unitId_seeded_01,
  items: [
    orderItemInputBase(productSnapshotFixture.chainProduct_1),
    orderItemInputBase(productSnapshotFixture.chainProduct_2),
    orderItemInputBase(productSnapshotFixture.chainProduct_3),
  ],
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

const historyOrderInputBase = {
  ...orderInputBase,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
  orderNum: '000',
  archived: true,
};

const convertInputToOrder = (
  input: CrudApi.CreateOrderInput,
): CrudApi.Order => ({
  ...input,
  id: input.id || '',
  createdAt: '2021-08-02T01:54:11.843Z',
  updatedAt: '2021-08-02T01:54:11.843Z',
  statusLog: [],
  archived: !!input.archived,
});

export const orderFixtureBase = {
  order_seeded_01_id,
  orderInputBase,
  orderItemInputBase,

  historyOrderInputBase,

  // Converter
  convertInputToOrder,
};
