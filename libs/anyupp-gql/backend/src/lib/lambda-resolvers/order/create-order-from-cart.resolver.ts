import { DateTime } from 'luxon';
import { combineLatest, iif, Observable, of, throwError } from 'rxjs';
import { catchError, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';

import {
  CrudApi,
  CrudApiMutationDocuments,
  CrudApiQueryDocuments,
} from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import {
  validateCart,
  validateGetGroupCurrency,
  validateOrder,
  validateUnit,
} from '@bgap/shared/data-validators';
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
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
  removeTypeNameField,
} from '@bgap/shared/utils';

import { incrementOrderNum } from '../../database';
import { toFixed2Number } from '../../utils';
import { calculateOrderSumPrice } from './order.utils';

const UNIT_TABLE_NAME = tableConfig.Unit.tableName;

export const createOrderFromCart = ({
  userId,
  cartId,
  crudGraphqlClient,
}: {
  userId: string;
  cartId: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<string> => {
  return of('START').pipe(
    switchMap(() =>
      getCart(crudGraphqlClient, cartId).pipe(
        // CART.USERID CHECK
        switchMap(cart =>
          cart.userId === userId
            ? of(cart)
            : throwError(getCartIsMissingError()),
        ),
        // CART.PaymentMode CHECK
        switchMap(cart =>
          cart.paymentMode !== undefined
            ? of(cart)
            : throwError(missingParametersError('cart.paymentMode')),
        ),
      ),
    ),
    switchMap(cart =>
      getUnit(crudGraphqlClient, cart.unitId).pipe(
        // TODO: ??? create catchError and custom error
        map(unit => ({ cart, unit })),
        // UNIT.IsAcceptingOrders CHECK
        switchMap(props =>
          props.unit.isAcceptingOrders
            ? of(props)
            : throwError(getUnitIsNotAcceptingOrdersError()),
        ),
        // INSPECTIONS
        // TODO: distance check
        //     // if (
        //     //   !userLocation ||
        //     //   distanceBetweenLocationsInMeters(userLocation, unit.address.location) >
        //     //     USER_UNIT_DISTANCE_THRESHOLD_IN_METER
        //     // ) {
        //     //   // TODO: re enable this when the FE is ready throw getUserIsTooFarFromUnitError();
        //     //   console.log('###: User is too far from the UNIT error should be thrown');
        //     // }
      ),
    ),
    switchMap(props =>
      getGroupCurrency(crudGraphqlClient, props.unit?.groupId).pipe(
        // TODO: ??? create catchError and custom error
        map(currency => ({ ...props, currency })),
      ),
    ),
    switchMap(props =>
      getNextOrderNum(UNIT_TABLE_NAME)({
        unitId: props.unit.id,
        place: props.cart.place,
      }).pipe(map(orderNum => ({ ...props, orderNum }))),
    ),
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
        orderNum: props.orderNum,
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
      deleteCart(crudGraphqlClient, props.cart.id).pipe(mapTo(props.orderId)),
    ),
  );
};

const toOrderInputFormat = ({
  userId,
  unitId,
  orderNum,
  paymentMode,
  items,
  place,
}: {
  userId: string;
  unitId: string;
  orderNum: string;
  paymentMode: IPaymentMode;
  items: CrudApi.OrderItemInput[];
  place: IPlace | undefined;
}): CrudApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    orderNum,
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
  return {
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
    allergens: cartItem.allergens,
  };
};

const getLaneIdForCartItem = (
  crudGraphqlClient: GraphqlApiClient,
  productId: string,
): Observable<string | undefined> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitProductQuery>(
    CrudApiQueryDocuments.getUnitProductLaneId,
    { id: productId },
  ).pipe(
    map(response => response.getUnitProduct),
    map(product => product?.laneId || undefined),
  );
};

const createStatusLog = (
  userId: string,
  status: EOrderStatus = EOrderStatus.NONE,
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

const getNextOrderNum = (tableName: string) => ({
  unitId,
  place,
}: {
  unitId: string;
  place: IPlace | undefined;
}): Observable<string> => {
  return incrementOrderNum(tableName)(unitId).pipe(
    mergeMap(lastOrderNum =>
      iif(
        () => !!lastOrderNum,
        of(lastOrderNum!),
        of(Math.floor(Math.random() * 10)), // In case of the lastOrderNum is missing get a random number between 0-99
      ),
    ),
    map(x => x.toString().padStart(2, '0')),
    map(num => (place ? `${place.table}${place.seat}${num}` : num)),
  );
};
