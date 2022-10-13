import {
  Allergen,
  CreateOrderInput,
  CreateUnitProductInput,
  Order,
  OrderMode,
  OrderStatus,
  ProductComponentSetType,
  ProductType,
  ServingMode,
  Variant,
} from '@bgap/domain';
import { seededIdPrefix, testIdPrefix } from './common';
import { getOrderStatusLog } from './order-utils';
import { unitFixture } from './unit';

const order_seeded_01_id = `${seededIdPrefix}order_1_id`;

const orderItemInputBase = (
  productFixture: CreateUnitProductInput,
  variants: Variant[],
) => ({
  quantity: 5,
  productId: productFixture.id || '',
  statusLog: [
    {
      userId: 'test-monad',
      status: OrderStatus.none,
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
  variantId: variants[0]?.id || '',
  variantName: variants[0]?.variantName || {
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
      type: ProductComponentSetType.modifier,
      items: [
        {
          productComponentId: `${testIdPrefix}product_component_id`,
          name: {
            de: 'Room temperature',
            en: 'Room temperature',
            hu: 'Szobahőmérsékletű',
          },
          price: -1.7999999999999998,
          allergens: [Allergen.egg, Allergen.gluten],
        },
      ],
      productSetId: `${testIdPrefix}product_component_set_id`,
    },
  ],
  productType: ProductType.drink,
});

const orderInputBase = {
  userId: 'test-monad',
  unitId: unitFixture.kesdobalo.id,
  items: [],
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
  orderMode: OrderMode.instant,
  servingMode: ServingMode.inplace,
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
  ...getOrderStatusLog(OrderStatus.served),
  orderNum: '000',
  archived: true,
};

const convertInputToOrder = (input: CreateOrderInput): Order => ({
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
