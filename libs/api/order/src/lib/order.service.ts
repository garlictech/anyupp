import { AppsyncApi } from '@bgap/api/graphql/schema';
// import { EOrderStatus } from '@bgap/shared/types';
import { DateTime } from 'luxon';
import { calculateOrderSumPrice } from './order.utils';
import { toFixed2Number } from '@bgap/api/utils';

export const createOrderFromCart = async (
  userId: string,
  input: AppsyncApi.CreateOrderFromCartInput,
): Promise<boolean> => {
  console.log('### ~ file: order.service.ts ~ line 7 ~ userId', userId);
  console.log('### ~ file: order.service.ts ~ line 8 ~ input', input);

  const { unitId, paymentMethod, cartItems, place } = input;

  // TODO: re enable these checks
  // if (unit.isAcceptingOrders === false) {
  //   throw getUnitIsNotAcceptingOrdersError();
  // }

  // if (
  //   !userLocation ||
  //   distanceBetweenLocationsInMeters(userLocation, unit.address.location) >
  //     USER_UNIT_DISTANCE_THRESHOLD_IN_METER
  // ) {
  //   // TODO: re enable this when the FE is ready throw getUserIsTooFarFromUnitError();
  //   console.log('###: User is too far from the UNIT error should be thrown');
  // }

  // TODO: use a vtl to get the GROUP currency const currency = await getGroupCurrency(unit.groupId);
  const currency = 'HUF';
  const staffId = await getStaffId(unitId);
  // TODO: do we need laneId??? const items = await getLaneIdForOrdersItems(convertCartOrdersToOrderItems(userId, cart.orders, currency));
  const items = convertCartOrdersToOrderItems(userId, cartItems, currency);

  // TODO: const order: IOrder = {
  const order: any = {
    userId,
    takeAway: false,
    paymentMethod: paymentMethod,
    // created: DateTime.utc().toMillis(),
    items,
    staffId,
    // statusLog: createStatusLog(userId),
    sumPriceShown: {},
    place,
  };

  order.sumPriceShown = calculateOrderSumPrice(order);
  console.log('### ~ file: order.service.ts ~ line 49 ~ order', order);
  // await newOrderRef.set(order);
  // Remove the cart from the db after the order has been created successfully
  // await cartRef.remove();

  // return newOrderRef.key;

  return Promise.resolve(true);
};

const convertCartOrdersToOrderItems = (
  userId: string,
  cartItems: any[],
  currency: string,
): any[] => {
  // TODO: const convertCartOrdersToOrderItems = (
  //   userId: string,
  //   cartItems: AppsyncApi.CartItemInput[],
  //   currency: string,
  // ): AppsyncApi.OrderItem[] => {

  return cartItems.map(cartItem => {
    return {
      created: DateTime.utc().toMillis(),
      productName: cartItem.product.name,
      priceShown: {
        currency,
        pricePerUnit: cartItem.variant.price,
        priceSum: toFixed2Number(cartItem.variant.price * cartItem.quantity),
        tax: cartItem.product.tax,
        taxSum: toFixed2Number(
          cartItem.variant.price *
            cartItem.quantity *
            (cartItem.product.tax / 100),
        ),
      },
      productId: cartItem.product.id,
      quantity: cartItem.quantity,
      variantId: cartItem.variant.id,
      variantName: cartItem.variant.variantName,
      statusLog: createStatusLog(userId),
    };
  });
};

// const getLaneIdForOrdersItems = async (orderItems: OrderItem[]): Promise<OrderItem[]> => {
//   const firestore = firestoreUtil(fContext);
//   const promises = orderItems.map(async (orderItem) => {
//       const product = await firestore.getRefValue<MergedProductWithIds>(
//           firestore.mergedProductsProductRef(orderItem.productId)
//       );
//       if (!!product && !!product.laneId) {
//           return { ...orderItem, laneId: product.laneId };
//       }
//       return { ...orderItem };
//   });
//   return Promise.all(promises);
// };

export const createStatusLog = (
  userId: string,
  // TODO: status: EOrderStatus = EOrderStatus.PLACED,
  status = 'PLACED',
) => ({
  // [DateTime.utc().toMillis()]: { userId, status },
  [DateTime.utc().toMillis()]: { userId, status },
});

// const getGroupCurrency = async (groupId: string): Promise<string> => {
//   const group = await db(fContext).getRefValue<Group>(db(fContext).groupsGroupRef(groupId));
//   return group.currency;
// };
// TODO: get staff id from somewhere
const getStaffId = async (unitId: string): Promise<string> => {
  return Promise.resolve('STAFF_ID');
};
