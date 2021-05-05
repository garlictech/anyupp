import { DateTime } from 'luxon';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import {
  CrudApi,
  CrudApiMutationDocuments,
  CrudApiQueryDocuments,
} from '@bgap/crud-gql/api';
import { removeTypeNameField } from '../../utils/graphql.utils';
import { toFixed2Number } from '../../utils/number.utils';
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
  IUnitProduct,
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
  crudGraphqlClient,
}: {
  userId: string;
  cartId: string;
  crudGraphqlClient: GraphqlApiClient;
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

  return getCart(crudGraphqlClient, cartId).pipe(
    // CART.USERID CHECK
    switchMap(cart =>
      cart.userId === userId ? of(cart) : throwError(getCartIsMissingError()),
    ),
    switchMap(cart =>
      getUnit(crudGraphqlClient, cart.unitId).pipe(
        // TODO: ??? create catchError and custom error
        // pipeDebug('### UNIT'),
        map(unit => ({ cart, unit })),
      ),
    ),
    switchMap(props =>
      getGroupCurrency(crudGraphqlClient, props.unit?.groupId).pipe(
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
        crudGraphqlClient: crudGraphqlClient,
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
      createOrderInDb({
        orderInput: props.orderInput,
        crudGraphqlClient: crudGraphqlClient,
      }).pipe(map(x => ({ ...props, orderId: x.id as string }))),
    ),
    // Remove the cart from the db after the order has been created successfully
    switchMap(props =>
      deleteCart(crudGraphqlClient, props.cart.id).pipe(
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
  items: CrudApi.OrderItemInput[];
  place: IPlace | undefined;
}): CrudApi.CreateOrderInput => {
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
    // If payment mode is inapp set the state to NONE (because need payment first), otherwise set to PLACED
    status: paymentMode.method == CrudApi.PaymentMethod.INAPP ? CrudApi.OrderStatus.NONE : CrudApi.OrderStatus.PLACED,
  };
};

const getOrderItems = ({
  userId,
  cartItems,
  currency,
  crudGraphqlClient,
}: {
  userId: string;
  cartItems: IOrderItem[];
  currency: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<CrudApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getLaneIdForCartItem(crudGraphqlClient, cartItem.productId).pipe(
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
}): CrudApi.OrderItemInput => {
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
  crudGraphqlClient: GraphqlApiClient,
  productId: string,
): Observable<string | undefined> => {
  return getUnitProduct(crudGraphqlClient, productId).pipe(
    map(product => product.laneId),
  );
};

const getUnitProduct = (
  crudGraphqlClient: GraphqlApiClient,
  productId: string,
): Observable<IUnitProduct> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitProductQuery>(
    CrudApiQueryDocuments.getUnitProduct,
    { id: productId },
  ).pipe(
    map(product => product.getUnitProduct),
    switchMap(validateUnitProduct),
  );
};

const createStatusLog = (
  userId: string,
  status: EOrderStatus = EOrderStatus.PLACED,
): Array<CrudApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

// TODO: get staff id from somewhere
// const getStaffId = async (unitId: string): Promise<string> => {
//   return Promise.resolve('STAFF_ID');
// };

const createOrderInDb = ({
  orderInput,
  crudGraphqlClient,
}: {
  orderInput: CrudApi.CreateOrderInput;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<IOrder> => {
  return executeMutation(crudGraphqlClient)<CrudApi.CreateOrderMutation>(
    CrudApiMutationDocuments.createOrder,
    {
      input: orderInput,
    },
  ).pipe(
    map(x => x.createOrder),
    switchMap(validateOrder),
  );
};

const getUnit = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<IUnit> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitQuery>(
    CrudApiQueryDocuments.getUnit,
    { id },
  ).pipe(
    map(x => x.getUnit),
    switchMap(validateUnit),
    catchError(err => {
      console.error(err);
      return throwError('Internal Unit query error');
    }),
  );
};

const getCart = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<ICart> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetCartQuery>(
    CrudApiQueryDocuments.getCart,
    { id },
  ).pipe(
    map(x => x.getCart),
    switchMap(validateCart),
    catchError(err => {
      console.error(err);
      return throwError('Internal Cart query error');
    }),
  );
};

const deleteCart = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<boolean> => {
  return executeMutation(crudGraphqlClient)<CrudApi.DeleteCartMutation>(
    CrudApiMutationDocuments.deleteCart,
    { input: { id } },
  ).pipe(
    mapTo(true),
    catchError(err => {
      console.error(err);
      return throwError('Internal Cart Delete error');
    }),
  );
};

const getGroupCurrency = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<string> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetGroupQuery>(
    CrudApiQueryDocuments.getGroupCurrency,
    { id },
  ).pipe(
    map(x => x.getGroup),
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
    catchError(err => {
      console.error(err);
      return throwError('Internal GroupCurrency query error');
    }),
  );
};
