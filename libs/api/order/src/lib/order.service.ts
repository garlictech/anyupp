import { DateTime } from 'luxon';
import { combineLatest, Observable } from 'rxjs';
import { map, mapTo, switchMap, tap, throwIfEmpty } from 'rxjs/operators';

import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
  AmplifyApiQueryDocuments,
} from '@bgap/admin/amplify-api';
import { toFixed2Number } from '@bgap/api/utils';
import {
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  EOrderStatus,
  ICart,
  IOrderItem,
  IUnit,
  validateCart,
  validateUnit,
} from '@bgap/shared/types';
import {
  getUnitIsNotAcceptingOrdersError,
  missingParametersCheck,
  pipeDebug,
} from '@bgap/shared/utils';

import { calculateOrderSumPrice } from './order.utils';

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
      // pipeDebug('### CART'),
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
      tap({
        next({ unit }) {
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
        },
      }),
      switchMap(props =>
        getOrderItems({
          graphqlApiClient,
          userId,
          currency: props.currency,
          cartItems: props.cart.items,
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
        createOrder({ orderInput: props.orderInput, graphqlApiClient }).pipe(
          map(o => ({ ...props, orderId: o.createOrder?.id as string })),
        ),
      ),
      // Remove the cart from the db after the order has been created successfully
      switchMap(props =>
        deleteCart(graphqlApiClient, props.cart.id).pipe(
          mapTo(props.orderId),
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
  cartItems: IOrderItem[];
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
  cartItem: IOrderItem;
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
    productName: cartItem.productName,
    priceShown: {
      currency,
      pricePerUnit: cartItem.priceShown.pricePerUnit,
      priceSum: toFixed2Number(
        cartItem.priceShown.pricePerUnit * cartItem.quantity,
      ),
      tax: cartItem.priceShown.tax,
      taxSum: toFixed2Number(
        cartItem.priceShown.pricePerUnit *
          cartItem.quantity *
          (cartItem.priceShown.tax / 100),
      ),
    },
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    variantId: cartItem.variantId,
    variantName: cartItem.variantName,
    statusLog: createStatusLog(userId),
    laneId,
  };
};

const getLaneIdForCartItem = (
  graphqlApiClient: GraphqlApiClient,
  productId: string,
): Observable<string | null | undefined> => {
  return executeQuery(graphqlApiClient)<AmplifyApi.GetUnitProductQuery>(
    AmplifyApiQueryDocuments.getUnitProduct,
    { id: productId },
  ).pipe(map(product => product.getUnitProduct?.laneId));
};

const createStatusLog = (
  userId: string,
  status: EOrderStatus = EOrderStatus.PLACED,
): Array<AmplifyApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

// TODO: get staff id from somewhere
// const getStaffId = async (unitId: string): Promise<string> => {
//   return Promise.resolve('STAFF_ID');
// };

const createOrder = ({
  orderInput,
  graphqlApiClient,
}: {
  orderInput: AmplifyApi.CreateOrderInput;
  graphqlApiClient: GraphqlApiClient;
}) => {
  return executeMutation(graphqlApiClient)<AmplifyApi.CreateOrderMutation>(
    AmplifyApiMutationDocuments.createOrder,
    {
      input: orderInput,
    },
  ).pipe(throwIfEmpty(() => 'Order is not in response'));
};

const getUnit = (
  graphqlApiClient: GraphqlApiClient,
  id: string,
): Observable<IUnit> => {
  return executeQuery(graphqlApiClient)<AmplifyApi.GetUnitQuery>(
    AmplifyApiQueryDocuments.getUnit,
    { id },
  ).pipe(
    map(o => o.getUnit),
    switchMap(validateUnit),
  );
};

const getCart = (
  graphqlApiClient: GraphqlApiClient,
  id: string,
): Observable<ICart> => {
  return executeQuery(graphqlApiClient)<AmplifyApi.GetCartQuery>(
    AmplifyApiQueryDocuments.getCart,
    { id },
  ).pipe(
    map(x => x.getCart),
    switchMap(validateCart),
  );
};

const deleteCart = (
  graphqlApiClient: GraphqlApiClient,
  id: string,
): Observable<boolean> => {
  return executeMutation(graphqlApiClient)<AmplifyApi.DeleteCartMutation>(
    AmplifyApiMutationDocuments.deleteCart,
    { input: { id } },
  ).pipe(mapTo(true));
};

const getGroupCurrency = (graphqlApiClient: GraphqlApiClient, id: string) => {
  return executeQuery(graphqlApiClient)<AmplifyApi.GetGroupQuery>(
    AmplifyApiQueryDocuments.getGroupCurrency,
    { input: { id } },
  ).pipe(
    // getFieldOrThrowMap('getUnit'),
    // map(o => getFieldOrThrow(o, 'getUnit')),
    // pluck<AmplifyApi.GetUnitQuery, AmplifyApi.Unit>('getUnit'),
    map(o => o.getGroup?.currency as string),
    throwIfEmpty(() => 'Missing GroupCurrency'),
  );
};
