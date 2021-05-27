import * as CrudApi from '@bgap/crud-gql/api';
import { unitSeed } from './unit';
import { productSeed } from './product';
import { seededIdPrefix, testIdPrefix } from './common';

const cartId_01 = `${testIdPrefix}cart_1_id`;
const cart_seeded_01_id = `${seededIdPrefix}cart_1_id`;
const unitId_01 = unitSeed.unitId_seeded_01;
const unitProductId_01 = productSeed.unitProductId_seeded_id_01;

// fictional - not exsisting
const cartId_NotExisting = `${testIdPrefix}NOT_EXSISTING_CART`;
const variantId_01 = `${testIdPrefix}variant_1_id`;
const laneId_01 = `${testIdPrefix}lane_1_id`;
const userId_01 = `${testIdPrefix}user_1_id`;

const getOrderItem = (): CrudApi.OrderItemInput => ({
  productName: {
    en: 'Water',
    hu: 'Viz',
  },
  priceShown: {
    currency: 'EUR',
    pricePerUnit: 1,
    priceSum: 2,
    tax: 1,
    taxSum: 2,
  },
  // productId: generateUnitProductId(chainIdx, groupIdx, productIdx),
  productId: unitProductId_01,
  quantity: 2,
  // variantId: generateVariantId(chainIdx, productIdx, 1),
  variantId: variantId_01,
  variantName: {
    en: 'glass',
    hu: 'pohár',
  },
  // laneId: generateLaneId(chainIdx, groupIdx, unitIdx, 1),
  laneId: laneId_01,
  statusLog: [
    {
      userId: userId_01,
      status: CrudApi.OrderStatus.placed,
      ts: 1234,
    },
  ],
});

// const cart_01: Required<CrudApi.CreateCartInput> = {
const cart_01 = {
  id: cartId_01,
  userId: userId_01,
  unitId: unitId_01,
  takeAway: false,
  paymentMode: {
    name: 'IN_APP',
    method: CrudApi.PaymentMethod.inapp,
  },
  place: {
    seat: 'SEAT',
    table: 'TABLE',
  },
  items: [getOrderItem()],
};

export const cartSeed = {
  cart_seeded_01_id,
  cartId_NotExisting,
  cart_01,
};
