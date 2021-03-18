import gql from 'graphql-tag';
// import { EOrderStatus } from '@bgap/shared/types';
import { DateTime } from 'luxon';
import { combineLatest, Observable } from 'rxjs';
import { map, pluck, switchMap, tap, throwIfEmpty } from 'rxjs/operators';

import {
  AmplifyApi,
  AmplifyApiMutations,
  AmplifyApiQueries,
} from '@bgap/admin/amplify-api';
import { AppsyncApi } from '@bgap/api/graphql/schema';
import { toFixed2Number } from '@bgap/api/utils';
import {
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IPlace } from '@bgap/shared/types';
import { pipeDebug } from '@bgap/shared/utils';

import { calculateOrderSumPrice } from './order.utils';

export const createOrderFromCart = async ({
  userId,
  unitId,
  paymentMethod,
  place,
  graphqlApiClient,
}: {
  userId: string;
  unitId: string;
  paymentMethod: string;
  place: IPlace;
  graphqlApiClient: GraphqlApiClient;
}): Promise<string> => {
  console.log(
    '### ~ file: order.service.ts ~ line 39 ~ INPUT PARAMS',
    JSON.stringify({
      unitId,
      paymentMethod,
      place,
    }),
    undefined,
    2,
  );
  return getUnit(graphqlApiClient, unitId)
    .pipe(
      pipeDebug('### UNIT'),
      switchMap(unit =>
        getGroupCurrency(graphqlApiClient, unit?.groupId!).pipe(
          map(currency => ({ currency, unit })),
        ),
      ),
      pipeDebug('### CURRENCY + UNIT'),
      tap(({ unit }) => {
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
      }),
      switchMap(({ currency }) =>
        getOrderItems({ graphqlApiClient, userId, currency, cartItems }),
      ),
      map(items =>
        toOrderInputFormat({ userId, unitId, paymentMethod, items, place }),
      ),
      switchMap(orderInput =>
        saveOrder({ orderInput, graphqlApiClient }).pipe(
          map(o => o.createOrder?.id as string),
          pipeDebug('### Response'),
        ),
      ),
    )
    .toPromise();

  // // await newOrderRef.set(order);
  // // Remove the cart from the db after the order has been created successfully
  // // await cartRef.remove();

  // // return newOrderRef.key;

  // try {
  //   const orderCreateResult = await graphqlApiClient
  //     .mutate<AmplifyApi.CreateOrderMutation>(createOrderMutation, {
  //       input: order,
  //     })
  //     .toPromise();

  //   console.log(
  //     '### ~ file: order.service.ts ~ line 67 ~ orderCreateResult',
  //     orderCreateResult,
  //   );
  //   return !!orderCreateResult.data.createOrder?.id;
  // } catch (error) {
  //   console.error(error);
  //   throw error;
  // }
};

const toOrderInputFormat = ({
  userId,
  unitId,
  paymentMethod,
  items,
  place,
}: {
  userId: string;
  unitId: string;
  paymentMethod: string;
  items: AmplifyApi.OrderItemInput[];
  place: IPlace;
}): AmplifyApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    paymentMethod: paymentMethod,
    // created: DateTime.utc().toMillis(),
    items: items,
    staffId: 'STAFF_ID',
    // TODO: do we need this?? statusLog: createStatusLog(userId),
    statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPrice(items),
    place,
    unitId,
  };
};

const getOrderItems = ({
  userId,
  cartItems,
  currency,
  graphqlApiClient,
}: {
  userId: string;
  cartItems: AppsyncApi.CartItemInput[];
  currency: string;
  graphqlApiClient: GraphqlApiClient;
}): Observable<AmplifyApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getLaneIdForCartItem(graphqlApiClient, cartItem.product.id).pipe(
        map(laneId =>
          convertCartOrderToOrderItem({
            userId,
            cartItem,
            currency,
            laneId,
          }),
        ),
      ),
    ),
  );
};

const convertCartOrderToOrderItem = ({
  userId,
  cartItem,
  currency,
  laneId,
}: {
  userId: string;
  cartItem: AppsyncApi.CartItemInput;
  currency: string;
  laneId: string | null | undefined;
}): AmplifyApi.OrderItemInput => {
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
    laneId,
  };
};

const getLaneIdForCartItem = (
  graphqlApiClient: GraphqlApiClient,
  id: string,
): Observable<string | null | undefined> => {
  return executeQuery(graphqlApiClient)<AmplifyApi.GetUnitProductQuery>(
    AmplifyApiQueries.getUnitProduct,
    { id },
  ).pipe(
    // getFieldOrThrowMap<AmplifyApi.GetUnitProductQuery>('getUnitProduct'),
    map(product => product.getUnitProduct?.laneId),
    // pluck('getUnitProduct', 'laneId'),
    // throwIfEmpty(() => 'Order is not in response'),
  );
};

const createStatusLog = (
  userId: string,
  // TODO: status: EOrderStatus = EOrderStatus.PLACED,
  status = 'PLACED',
): Array<AmplifyApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

// TODO: get staff id from somewhere
// const getStaffId = async (unitId: string): Promise<string> => {
//   return Promise.resolve('STAFF_ID');
// };

const saveOrder = ({
  orderInput,
  graphqlApiClient,
}: {
  orderInput: AmplifyApi.CreateOrderInput;
  graphqlApiClient: GraphqlApiClient;
}) => {
  return executeMutation(graphqlApiClient)<AmplifyApi.CreateOrderMutation>(
    AmplifyApiMutations.createOrder,
    {
      input: orderInput,
    },
  ).pipe(throwIfEmpty(() => 'Order is not in response'));
};

const getUnit = (
  graphqlApiClient: GraphqlApiClient,
  unitId: string,
): Observable<AmplifyApi.Unit> =>
  executeQuery(graphqlApiClient)<AmplifyApi.GetUnitQuery>(
    AmplifyApiQueries.getUnit,
    {
      id: unitId,
    },
  ).pipe(
    // getFieldOrThrowMap('getUnit'),
    // map(o => getFieldOrThrow(o, 'getUnit')),
    // pluck<AmplifyApi.GetUnitQuery, AmplifyApi.Unit>('getUnit'),
    map(o => o.getUnit as AmplifyApi.Unit),
    throwIfEmpty(() => 'Missing Unit'),
  );

const getGroupCurrency = (
  graphqlApiClient: GraphqlApiClient,
  groupId: string,
) =>
  executeQuery(graphqlApiClient)<AmplifyApi.GetGroupQuery>(
    AmplifyApiQueries.getGroupCurrency,
    {
      id: groupId,
    },
  ).pipe(
    // getFieldOrThrowMap('getUnit'),
    // map(o => getFieldOrThrow(o, 'getUnit')),
    // pluck<AmplifyApi.GetUnitQuery, AmplifyApi.Unit>('getUnit'),
    map(o => o.getGroup?.currency as string),
    throwIfEmpty(() => 'Missing GroupCurrency'),
  );
