import { DateTime } from 'luxon';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
  AmplifyApiQueryDocuments,
} from '@bgap/admin/amplify-api';
import { removeTypeNameField, toFixed2Number } from '@bgap/api/utils';
import {
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import {
  EOrderStatus,
  ICart,
  IOrder,
  IOrderItem,
  IPaymentMode,
  IPlace,
  IUnit,
} from '@bgap/shared/types';
import {
  validateCart,
  validateGetGroupCurrency,
  validateOrder,
  validateUnit,
  validateUnitProduct,
} from '@bgap/shared/data-validators';

import {
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
  pipeDebug,
} from '@bgap/shared/utils';

import { calculateOrderSumPrice } from './order.utils';

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
    // CART.USERID CHECK
    switchMap(cart =>
      cart.userId === userId ? of(cart) : throwError(getCartIsMissingError()),
    ),
    switchMap(cart =>
      getUnit(amplifyGraphQlClient, cart.unitId).pipe(
        // TODO: ??? create catchError and custom error
        // pipeDebug('### UNIT'),
        map(unit => ({ cart, unit })),
      ),
    ),
    switchMap(props =>
      getGroupCurrency(amplifyGraphQlClient, props.unit?.groupId).pipe(
        // TODO: ??? create catchError and custom error
        map(currency => ({ ...props, currency })),
      ),
    ),
    // pipeDebug('### CURRENCY + UNIT'),
    // INSPECTIONS
    switchMap(props =>
      props.unit.isAcceptingOrders
        ? of(props)
        : throwError(getUnitIsNotAcceptingOrdersError()),
    ),
    switchMap(props =>
      props.cart.paymentMode !== undefined
        ? of(props)
        : throwError(missingParametersError('cart.paymentMode')),
    ),
    // TODO: distance check
    //     // if (
    //     //   !userLocation ||
    //     //   distanceBetweenLocationsInMeters(userLocation, unit.address.location) >
    //     //     USER_UNIT_DISTANCE_THRESHOLD_IN_METER
    //     // ) {
    //     //   // TODO: re enable this when the FE is ready throw getUserIsTooFarFromUnitError();
    //     //   console.log('###: User is too far from the UNIT error should be thrown');
    //     // }
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        paymentMode: props.cart.paymentMode!, // see missingParametersCheck above
        items: props.items,
        place: props.cart.place,
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
  paymentMode,
  items,
  place,
}: {
  userId: string;
  unitId: string;
  paymentMode: IPaymentMode;
  items: AmplifyApi.OrderItemInput[];
  place: IPlace | undefined;
}): AmplifyApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    paymentMode: removeTypeNameField(paymentMode),
    // created: DateTime.utc().toMillis(),
    items: items,
    // TODO: do we need this?? statusLog: createStatusLog(userId),
    statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPrice(items),
    place: removeTypeNameField(place),
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
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
  );
};
