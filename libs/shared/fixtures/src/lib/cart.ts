import { RequiredId } from '@bgap/shared/types';
import {
  Allergen,
  CreateCartInput,
  OrderItemInput,
  OrderStatus,
  PaymentMethod,
  PaymentType,
  ProductType,
} from '@bgap/domain';
import { testIdPrefix } from './common';
import { productFixture } from './product';
import { unitFixture } from './unit';
const cartId_01 = `${testIdPrefix}cart_1_id`;
const unitId_01 = unitFixture.unitId_seeded_01;
const unitProductId_01 = productFixture.unitProductId_seeded_id_01;
// fictional - not exsisting
const cartId_NotExisting = `${testIdPrefix}NOT_EXSISTING_CART`;
const variantId_01 = `${testIdPrefix}variant_1_id`;
const laneId_01 = `${testIdPrefix}lane_1_id`;
const userId_01 = `${testIdPrefix}user_1_id`;
const getOrderItem = (
  {
    tax,
  }: {
    tax: number;
  } = { tax: 0 },
): OrderItemInput => ({
  productName: {
    en: 'Water',
    hu: 'Viz',
  },
  priceShown: {
    currency: 'EUR',
    pricePerUnit: 1,
    priceSum: 2,
    tax, // this value wont be used, the tax will be collected from the product
    taxSum: 0, // not used
  },
  sumPriceShown: {
    currency: 'EUR',
    pricePerUnit: 1,
    priceSum: 2,
    tax,
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
      status: OrderStatus.placed,
      ts: 1234,
    },
  ],
  allergens: [Allergen.treenuts],
  productType: ProductType.food,
});
const cart_01: RequiredId<CreateCartInput> = {
  id: cartId_01,
  userId: userId_01,
  unitId: unitId_01,
  takeAway: false,
  paymentMode: {
    type: PaymentType.stripe,
    method: PaymentMethod.inapp,
  },
  place: {
    seat: 'SEAT',
    table: 'TABLE',
  },
  items: [getOrderItem()],
  // servingMode: ServingMode.inplace, CURRENTLY this attribute is OPTIONAL so the logic should work without it TOO (handled in #1835)
};
export const cartFixture = {
  cartId_NotExisting,
  cart_01,
  getOrderItem,
};
