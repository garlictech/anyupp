import { EOrderStatus } from '@bgap/shared/types';
import { CrudApi } from '@bgap/crud-gql/api';
import { unitProductSeed } from './unit-product';
import { unitSeed } from './unit';

const cartId_01 = 'cart_1_id';
const cart_seeded_01_id = 'cart_1_id_seeded';
const unitId_01 = unitSeed.unitId_seeded_01;
const unitProductId_01 = unitProductSeed.unitProductId_seeded;

// fictional - not exsisting
const cartId_NotExisting = 'NOT_EXSISTING_CART';
const variantId_01 = 'variant_1_id';
const laneId_01 = 'lane_1_id';
const userId_01 = 'user_1_id';

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
      status: EOrderStatus.PLACED,
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
    method: CrudApi.PaymentMethod.INAPP,
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
