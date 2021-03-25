import { DateTime } from 'luxon';
import { combineLatest, Observable } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';

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
  validateOrder,
  validateUnit,
  validateUnitProduct,
} from '@bgap/shared/types';
import {
  getUnitIsNotAcceptingOrdersError,
  pipeDebug,
} from '@bgap/shared/utils';

import { calculateOrderSumPrice } from './order.utils';
import { IOrder } from '@bgap/shared/types';

export const createOrderFromCart = ({
  userId,
  cartId,
  amplifyGraphQlClient,
}: {
  userId: string;
  cartId: string;
  amplifyGraphQlClient: GraphqlApiClient;
}): Observable<string> => {
  // console.log(
  //   '### ~ file: order.service.ts ~ line 39 ~ INPUT PARAMS',
  //   JSON.stringify({
  //     userId,
  //     cartId,
  //   }),
  //   undefined,
  //   2,
  // );

  return getCart(amplifyGraphQlClient, cartId).pipe(
    // pipeDebug('### CART'),
    switchMap(cart =>
      getUnit(amplifyGraphQlClient, cart.unitId).pipe(
        // pipeDebug('### UNIT'),
        map(unit => ({ cart, unit })),
      ),
    ),
    switchMap(props =>
      getGroupCurrency(amplifyGraphQlClient, props.unit?.groupId).pipe(
        map(currency => ({ ...props, currency })),
      ),
    ),
    // pipeDebug('### CURRENCY + UNIT'),
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
        amplifyApiClient: amplifyGraphQlClient,
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
        place: removeTypeNameField(props.cart.place),
      }),
    })),
    switchMap(props =>
      createOrder({
        orderInput: props.orderInput,
        amplifyApiClient: amplifyGraphQlClient,
      }).pipe(map(x => ({ ...props, orderId: x.id as string }))),
    ),
    // Remove the cart from the db after the order has been created successfully
    switchMap(props =>
      deleteCart(amplifyGraphQlClient, props.cart.id).pipe(
        mapTo(props.orderId),
        pipeDebug('### Response'),
      ),
    ),
  );
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
  place: AmplifyApi.PlaceInput;
}): AmplifyApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    paymentMethod: paymentMethod,
    // created: DateTime.utc().toMillis(),
    items: items,
    staffId: 'STAFF_ID', // TODO
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
  amplifyApiClient,
}: {
  userId: string;
  cartItems: IOrderItem[];
  currency: string;
  amplifyApiClient: GraphqlApiClient;
}): Observable<AmplifyApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getLaneIdForCartItem(amplifyApiClient, cartItem.productId).pipe(
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

// TODO: create a recursive version of this
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
const removeTypeNameField = ({ __typename, ...objectWithoutTypename }: any) =>
  objectWithoutTypename;

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
  // const {__typename, ...item} = cartItem;

  return {
    // ...cartItem,
    // created: DateTime.utc().toMillis(),
    productName: removeTypeNameField(cartItem.productName),
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
    variantName: removeTypeNameField(cartItem.variantName),
    statusLog: createStatusLog(userId),
    laneId,
  };
};

const getLaneIdForCartItem = (
  amplifyApiClient: GraphqlApiClient,
  productId: string,
): Observable<string | undefined> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetUnitProductQuery>(
    AmplifyApiQueryDocuments.getUnitProduct,
    { id: productId },
  ).pipe(
    map(product => product.getUnitProduct),
    switchMap(validateUnitProduct),
    map(product => product.laneId),
  );
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
  amplifyApiClient,
}: {
  orderInput: AmplifyApi.CreateOrderInput;
  amplifyApiClient: GraphqlApiClient;
}): Observable<IOrder> => {
  return executeMutation(amplifyApiClient)<AmplifyApi.CreateOrderMutation>(
    AmplifyApiMutationDocuments.createOrder,
    {
      input: orderInput,
    },
  ).pipe(
    map(x => x.createOrder),
    switchMap(validateOrder),
  );
};

const getUnit = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<IUnit> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetUnitQuery>(
    AmplifyApiQueryDocuments.getUnit,
    { id },
  ).pipe(
    map(x => x.getUnit),
    switchMap(validateUnit),
  );
};

const getCart = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<ICart> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetCartQuery>(
    AmplifyApiQueryDocuments.getCart,
    { id },
  ).pipe(
    map(x => x.getCart),
    switchMap(validateCart),
  );
};

const deleteCart = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<boolean> => {
  return executeMutation(amplifyApiClient)<AmplifyApi.DeleteCartMutation>(
    AmplifyApiMutationDocuments.deleteCart,
    { input: { id } },
  ).pipe(mapTo(true));
};

const getGroupCurrency = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<string> => {
  return executeQuery(amplifyApiClient)<AmplifyApi.GetGroupQuery>(
    AmplifyApiQueryDocuments.getGroupCurrency,
    { id },
  ).pipe(
    map(x => x.getGroup),
    switchMap(AmplifyApiQueryDocuments.validateGetGroupCurrency),
    map(x => x.currency),
  );
};
