import * as CrudApi from '@bgap/crud-gql/api';
import { unitFixture } from './unit';
import { productFixture } from './product';
import { seededIdPrefix, testIdPrefix } from './common';
import { RequiredId } from '@bgap/shared/types';

const cartId_01 = `${testIdPrefix}cart_1_id`;
const cart_seeded_01_id = `${seededIdPrefix}cart_1_id`;
const unitId_01 = unitFixture.unitId_seeded_01;
const unitProductId_01 = productFixture.unitProductId_seeded_id_01;

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
    taxSum: 0,
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
  laneId: laneId_01, // Optional, won't be in case the orderItem is an item of the cart.items
  statusLog: [
    {
      userId: userId_01,
      status: CrudApi.OrderStatus.placed,
      ts: 1234,
    },
  ],
  allergens: [CrudApi.Allergen.treenuts],
});

// const cart_01: Required<CrudApi.CreateCartInput> = {
const cart_01: RequiredId<CrudApi.CreateCartInput> = {
  id: cartId_01,
  userId: userId_01,
  unitId: unitId_01,
  takeAway: false,
  paymentMode: {
    type: CrudApi.PaymentType.stripe,
    method: CrudApi.PaymentMethod.inapp,
  },
  place: {
    seat: 'SEAT',
    table: 'TABLE',
  },
  items: [getOrderItem()],
};

export const cartFixture = {
  cart_seeded_01_id,
  cartId_NotExisting,
  cart_01,
  getOrderItem,
};
