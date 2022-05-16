import * as CrudApi from '@bgap/crud-gql/api';
import {
  Dish,
  RKeeperBusinessEntityInfo,
  RkeeperFixtures,
} from '@bgap/rkeeper-api';
import { RequiredId } from '@bgap/shared/types';
import {
  unitFixture,
  productFixture,
  chainFixture,
  groupFixture,
  rkeeperEndpoint,
  yellowRestaurantId,
  yellowRkeeperUsername,
  yellowRkeeperPassword,
} from '@bgap/shared/fixtures';

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
const chainId = `${testIdPrefix}-chain`;
const groupId = `${testIdPrefix}-group`;

export const rkeeperUnit: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitFixture.createRkeeperUnit,
  id: unitId,
  groupId,
  chainId,
  externalId: 'EXTERNAL-RESTAURANT-ID',
};

export const rkeeperUnitProduct: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct`,
  externalId: rkeeperProductGuid,
};

export const rkeeperUnitProduct2: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct2`,
  externalId: rkeeperProductGuid + '2',
};

export const processedDish: Dish = {
  price: 50000,
  active: true,
  id: 9991000114,
  guid: '999e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  name: 'Próba ital',
};

export const businessEntity: RKeeperBusinessEntityInfo = {
  chainId,
  groupId,
  unitId,
};

export const createChain: RequiredId<CrudApi.CreateChainInput> = {
  ...chainFixture.chainBase,
  id: chainId,
};

export const createGroup: RequiredId<CrudApi.CreateGroupInput> = {
  ...groupFixture.groupBase,
  id: groupId,
  chainId,
};

export const rkeeperOrder = {
  objectid: yellowRestaurantId,
  remoteId: yellowRestaurantId,
  order_type: 1,
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

export const yellowUnit = {
  ...rkeeperUnit,
  externalId: yellowRestaurantId,
  pos: {
    ...rkeeperUnit.pos,
    rkeeper: {
      ...(rkeeperUnit?.pos?.rkeeper || {}),
      rkeeperUsername: yellowRkeeperUsername,
      rkeeperPassword: yellowRkeeperPassword,
      endpointUri: rkeeperEndpoint,
    } as CrudApi.RKeeper,
  },
} as CrudApi.Unit;

export const orderInput: CrudApi.CreateOrderInput = {
  userId: 'USER_ID',
  unitId: yellowUnit.id,
  items: [
    {
      quantity: 5,
      productId: 'PRODUCT ID',
      statusLog: [
        {
          userId: 'USER_ID',
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
  orderMode: CrudApi.OrderMode.instant,
  servingMode: CrudApi.ServingMode.inplace,
  archived: false,
  paymentMode: {
    method: CrudApi.PaymentMethod.cash,
    type: CrudApi.PaymentType.cash,
  },
};

export {
  yellowRestaurantId,
  yellowRkeeperPassword,
  yellowRkeeperUsername,
  rkeeperEndpoint,
};
