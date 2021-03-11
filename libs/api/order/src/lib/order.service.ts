import { AmplifyApi, AppsyncApi } from '@bgap/api/graphql/schema';
import { toFixed2Number } from '@bgap/api/utils';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { IPlace } from '@bgap/shared/types';
// import * as AWS from 'aws-sdk';
import gql from 'graphql-tag';
// import { EOrderStatus } from '@bgap/shared/types';
import { DateTime } from 'luxon';
import { calculateOrderSumPrice } from './order.utils';

// const documentClient = new AWS.DynamoDB.DocumentClient({
//   convertEmptyValues: true,
// });
// TODO: relocate in the graphql/documents folder, but which OrderInput should I use? The one that is in the Amplify graphql or the appsync one???
const createOrderMutation = gql`
  mutation CreateOrderMutation($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
    }
  }
`;

export const createOrderFromCart = async ({
  userId,
  unitId,
  paymentMethod,
  cartItems,
  place,
  currency,
  graphqlApiClient,
}: {
  userId: string;
  unitId: string;
  paymentMethod: string;
  cartItems: AppsyncApi.CartItemInput[];
  place: IPlace;
  currency: string;
  graphqlApiClient: GraphqlApiClient;
}): Promise<boolean> => {
  // console.log(
  //   '### ~ file: order.service.ts ~ line 3 ~ EOrderStatus',
  //   EOrderStatus,
  // );

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

  // TODO: use a vtl to get the GROUP currency
  // const currency = await getGroupCurrency(unit.groupId);
  // const currency = 'HUF';
  const staffId = await getStaffId(unitId);
  // TODO: do we need laneId??? const items = await getLaneIdForOrdersItems(convertCartOrdersToOrderItems(userId, cart.orders, currency));
  const items = convertCartOrdersToOrderItems(userId, cartItems, currency);

  const order: AmplifyApi.CreateOrderInput = {
    userId,
    takeAway: false,
    paymentMethod: paymentMethod,
    // created: DateTime.utc().toMillis(),
    items,
    staffId,
    // TODO: do we need this?? statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPrice(items),
    place,
  };

  console.log(
    '### ~ file: order.service.ts ~ line 49 ~ order',
    JSON.stringify(order, undefined, 2),
  );
  // await newOrderRef.set(order);
  // Remove the cart from the db after the order has been created successfully
  // await cartRef.remove();

  // return newOrderRef.key;

  try {
    const orderCreateResult = await graphqlApiClient
      .mutate<AmplifyApi.CreateOrderMutation>(createOrderMutation, {
        input: order,
      })
      .toPromise();

    console.log(
      '### ~ file: order.service.ts ~ line 67 ~ orderCreateResult',
      orderCreateResult,
    );
    return !!orderCreateResult.data.createOrder?.id;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const convertCartOrdersToOrderItems = (
  userId: string,
  cartItems: any[],
  currency: string,
): AmplifyApi.OrderItemInput[] => {
  // TODO: const convertCartOrdersToOrderItems = (
  //   userId: string,
  //   cartItems: AppsyncApi.CartItemInput[],
  //   currency: string,
  // ): AppsyncApi.OrderItem[] => {

  return cartItems.map(cartItem => {
    return {
      // created: DateTime.utc().toMillis(),
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
): Array<AmplifyApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

// const getGroupCurrency = async (groupId: string): Promise<string> => {
//   const group = await db(fContext).getRefValue<Group>(db(fContext).groupsGroupRef(groupId));
//   return group.currency;
// };
// TODO: get staff id from somewhere
const getStaffId = async (unitId: string): Promise<string> => {
  return Promise.resolve('STAFF_ID');
};
