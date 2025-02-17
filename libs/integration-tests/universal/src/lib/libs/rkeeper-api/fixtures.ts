import {
  Dish,
  RKeeperBusinessEntityInfo,
  RkeeperFixtures,
} from '@bgap/rkeeper-api';
import { RequiredId } from '@bgap/shared/types';
import {
  rkeeperEndpoint,
  freiRestaurantId,
  freiRkeeperUsername,
  freiRkeeperPassword,
  createProductFixture,
  freiUnitId,
  createRkeeperUnit,
} from '@bgap/shared/fixtures';
import {
  CreateOrderInput,
  CreateUnitInput,
  CreateUnitProductInput,
  CreateVariantInput,
  OrderMode,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  ServingMode,
} from '@bgap/domain';

const testIdPrefix = `rkeeper-cf0d1110-a2ce-45cf-aa69-6782bbc44cad`;

export const rawData = {
  data: {
    dishes: [
      RkeeperFixtures.dish,
      RkeeperFixtures.dish2,
      RkeeperFixtures.duplicatedDish,
      RkeeperFixtures.badDish,
      RkeeperFixtures.inactiveDish,
      RkeeperFixtures.dishWithModifier,
      RkeeperFixtures.dishWithSameModifier,
    ],
    modifiers: [RkeeperFixtures.modifier, RkeeperFixtures.unusedModifier],
  },
};

export const rkeeperProductGuid = 'RKEEPERGUID';

const unitId = `${testIdPrefix}-unit`;

const productFixture = createProductFixture(
  unitId,
  'RKEEPER PRODUCT CATEGORY ID',
);

export const rkeeperUnit: RequiredId<CreateUnitInput> = {
  ...createRkeeperUnit,
  id: unitId,
  externalId: 'EXTERNAL-RESTAURANT-ID',
};

export const rkeeperUnitProduct: RequiredId<CreateUnitProductInput> = {
  ...productFixture,
  id: `${testIdPrefix}-unitproduct`,
};

export const rkeeperVariantFixture: RequiredId<CreateVariantInput> = {
  id: `${testIdPrefix}UnitProductVariant_id_1`,
  variantName: { en: `VARIANT_NAME_1` },
  isAvailable: true,
  price: 30,
  externalId: rkeeperProductGuid,
  position: -1,
  unitProductVariantsId: rkeeperUnitProduct.id,
};

export const rkeeperUnitProduct2: RequiredId<CreateUnitProductInput> = {
  ...productFixture,
  id: `${testIdPrefix}-unitproduct2`,
};

export const rkeeperVariantFixture2: RequiredId<CreateVariantInput> = {
  id: `${testIdPrefix}UnitProductVariant_id_2`,
  variantName: { en: `VARIANT_NAME_2` },
  isAvailable: true,
  price: 30,
  externalId: `${rkeeperProductGuid}-2`,
  position: -1,
  unitProductVariantsId: rkeeperUnitProduct2.id,
};

export const processedDish: Dish = {
  price: 50000,
  active: true,
  id: 9991000114,
  guid: '999e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  name: 'Próba ital',
};

export const businessEntity: RKeeperBusinessEntityInfo = {
  unitId,
};

export const rkeeperOrder = {
  objectid: freiRestaurantId,
  remoteId: freiRestaurantId,
  order_type: 1,
  order_number: 1,
  pay_type: 0,
  pay_online_type: 0,
  delivery_time: '2122-02-03T12:37:32',
  client: {
    phone: null,
    email: null,
    ln: 'Testln',
    fn: 'Testfn',
  },
  order: [
    {
      id: '1000114',
      type: 'd',
      qnt: 1000,
    },
  ],
};

export const orderInput: CreateOrderInput = {
  userId: 'USER_ID',
  unitId: freiUnitId,
  items: [
    {
      quantity: 5,
      productId: 'PRODUCT ID',
      statusLog: [
        {
          userId: 'USER_ID',
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
      productName: {
        hu: 'PRODUCT NAME HU',
      },
      priceShown: {
        taxSum: 318.9,
        currency: 'HUF',
        tax: 27,
        priceSum: 1500,
        pricePerUnit: 300,
      },
      variantId: 'VARIANT ID',
      variantName: {
        en: 'VARIANT NAME EN',
      },
    },
  ],
  sumPriceShown: {
    taxSum: 633.96,
    currency: 'HUF',
    tax: 27,
    priceSum: 2982,
    pricePerUnit: 298.2,
  },
  place: {
    table: '01',
    seat: '01',
  },
  orderMode: OrderMode.instant,
  servingMode: ServingMode.inplace,
  archived: false,
  paymentMode: {
    method: PaymentMethod.cash,
    type: PaymentType.cash,
  },
};

export {
  freiRestaurantId,
  freiRkeeperPassword,
  freiRkeeperUsername,
  rkeeperEndpoint,
};
