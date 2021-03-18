import { DateTime } from 'luxon';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap, throwIfEmpty, mapTo } from 'rxjs/operators';

// import { EOrderStatus } from '@bgap/shared/types';
import {
  AmplifyApi,
  AmplifyApiMutations,
  AmplifyApiQueries,
} from '@bgap/admin/amplify-api';
import { toFixed2Number } from '@bgap/api/utils';
import {
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  getUnitIsNotAcceptingOrdersError,
  pipeDebug,
} from '@bgap/shared/utils';

import { calculateOrderSumPrice } from './order.utils';
import { missingParametersCheck } from '@bgap/shared/utils';

export const createOrderFromCart = async ({
  userId,
  cartId,
  graphqlApiClient,
}: {
  userId: string;
  cartId: string;
  graphqlApiClient: GraphqlApiClient;
}): Promise<string> => {
  console.log(
    '### ~ file: order.service.ts ~ line 39 ~ INPUT PARAMS',
    JSON.stringify({
      userId,
      cartId,
    }),
    undefined,
    2,
  );

  return getCart(graphqlApiClient, cartId)
    .pipe(
      pipeDebug('### CART'),
      switchMap(cart =>
        getUnit(graphqlApiClient, cart.unitId).pipe(
          pipeDebug('### UNIT'),
          map(unit => ({ cart, unit })),
        ),
      ),
      switchMap(props =>
        getGroupCurrency(graphqlApiClient, props.unit?.groupId).pipe(
          map(currency => ({ ...props, currency })),
        ),
      ),
      pipeDebug('### CURRENCY + UNIT'),
      tap(({ unit }) => {
        if (unit.isAcceptingOrders === false) {
          throw getUnitIsNotAcceptingOrdersError();
        }
        // if (
        //   !userLocation ||
        //   distanceBetweenLocationsInMeters(userLocation, unit.address.location) >
        //     USER_UNIT_DISTANCE_THRESHOLD_IN_METER
        // ) {
        //   // TODO: re enable this when the FE is ready throw getUserIsTooFarFromUnitError();
        //   console.log('###: User is too far from the UNIT error should be thrown');
        // }
      }),
      switchMap(props =>
        getOrderItems({
          graphqlApiClient,
          userId,
          currency: props.currency,
          cartItems: props.cart.items!,
        }).pipe(map(items => ({ ...props, items }))),
      ),
      map(props => ({
        ...props,
        orderInput: toOrderInputFormat({
          userId,
          unitId: props.cart.unitId,
          paymentMethod: props.cart.paymentMethod,
          items: props.items,
          place: props.cart.place,
        }),
      })),
      switchMap(props =>
        saveOrder({ orderInput: props.orderInput, graphqlApiClient }).pipe(
          map(o => ({ ...props, orderId: o.createOrder?.id as string })),
        ),
      ),
      // Remove the cart from the db after the order has been created successfully
      switchMap(props =>
        deleteCart(graphqlApiClient, props.cart.id).pipe(
          map(o => props.orderId),
          pipeDebug('### Response'),
        ),
      ),
    )
    .toPromise();
};

const toOrderInputFormat = ({
  userId,
  unitId,
  paymentMethod,
  items,
  place,
}: {
  userId: string;
  unitId?: string;
  paymentMethod?: string;
  items?: AmplifyApi.OrderItemInput[];
  place?: AmplifyApi.PlaceInput;
}): AmplifyApi.CreateOrderInput => {
  if (!paymentMethod) throw 'Missing paymentMethod';
  if (!unitId) throw 'Missing unitId';
  if (!items) throw 'Missing items';
  if (!place) throw 'Missing place';

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
  cartItems: AmplifyApi.OrderItem[];
  currency: string;
  graphqlApiClient: GraphqlApiClient;
}): Observable<AmplifyApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getLaneIdForCartItem(graphqlApiClient, cartItem.productId).pipe(
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
  cartItem: AmplifyApi.OrderItem;
  currency: string;
  laneId: string | null | undefined;
}): AmplifyApi.OrderItemInput => {
  console.log(
    '### ~ file: order.service.ts ~ line 192 ~ cartItem',
    JSON.stringify(cartItem, undefined, 2),
  );
  missingParametersCheck<AmplifyApi.OrderItem>(cartItem, [
    'productName',
    'quantity',
    'productId',
    'priceShown',
  ]);
  missingParametersCheck<AmplifyApi.PriceShown>(cartItem.priceShown, [
    'pricePerUnit',
    'tax',
  ]);

  return {
    ...cartItem,
    // created: DateTime.utc().toMillis(),
    productName: cartItem.productName!,
    priceShown: {
      currency,
      pricePerUnit: cartItem.priceShown!.pricePerUnit,
      priceSum: toFixed2Number(
        cartItem.priceShown!.pricePerUnit! * cartItem.quantity!,
      ),
      tax: cartItem.priceShown!.tax,
      taxSum: toFixed2Number(
        cartItem.priceShown!.pricePerUnit! *
          cartItem.quantity! *
          (cartItem.priceShown!.tax! / 100),
      ),
    },
    productId: cartItem.productId!,
    quantity: cartItem.quantity!,
    variantId: cartItem.variantId!,
    variantName: cartItem.variantName!,
    statusLog: createStatusLog(userId),
    laneId,
  };
};

const getLaneIdForCartItem = (
  graphqlApiClient: GraphqlApiClient,
  productId?: string,
): Observable<string | null | undefined> => {
  if (!productId) throw 'Missing productId';

  return executeQuery(graphqlApiClient)<AmplifyApi.GetUnitProductQuery>(
    AmplifyApiQueries.getUnitProduct,
    { id: productId },
  ).pipe(map(product => product.getUnitProduct?.laneId));
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
  id?: string,
): Observable<AmplifyApi.Unit> => {
  if (!id) throw 'Missing UnitId';

  return executeQuery(graphqlApiClient)<AmplifyApi.GetUnitQuery>(
    AmplifyApiQueries.getUnit,
    { id },
  ).pipe(
    // getFieldOrThrowMap('getUnit'),
    // map(o => getFieldOrThrow(o, 'getUnit')),
    // pluck<AmplifyApi.GetUnitQuery, AmplifyApi.Unit>('getUnit'),
    map(o => o.getUnit as AmplifyApi.Unit),
    throwIfEmpty(() => 'Missing Unit'),
  );
};

const getCart = (
  graphqlApiClient: GraphqlApiClient,
  id?: string,
): Observable<AmplifyApi.Cart> => {
  if (!id) throw 'Missing CartId';

  return executeQuery(graphqlApiClient)<AmplifyApi.GetCartQuery>(
    AmplifyApiQueries.getCart,
    { id },
  ).pipe(
    map(o => o.getCart as AmplifyApi.Cart),
    throwIfEmpty(() => 'Missing Cart'),
  );
};

const deleteCart = (
  graphqlApiClient: GraphqlApiClient,
  id?: string,
): Observable<boolean> => {
  if (!id) throw 'Missing CartId';

  return executeMutation(graphqlApiClient)<AmplifyApi.DeleteCartMutation>(
    AmplifyApiMutations.deleteCart,
    { id },
  ).pipe(mapTo(true));
};

const getGroupCurrency = (graphqlApiClient: GraphqlApiClient, id?: string) => {
  if (!id) throw 'Missing GroupId';

  return executeQuery(graphqlApiClient)<AmplifyApi.GetGroupQuery>(
    AmplifyApiQueries.getGroupCurrency,
    { id },
  ).pipe(
    // getFieldOrThrowMap('getUnit'),
    // map(o => getFieldOrThrow(o, 'getUnit')),
    // pluck<AmplifyApi.GetUnitQuery, AmplifyApi.Unit>('getUnit'),
    map(o => o.getGroup?.currency as string),
    throwIfEmpty(() => 'Missing GroupCurrency'),
  );
};
