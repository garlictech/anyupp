import { DateTime } from 'luxon';
import { combineLatest, from, iif, Observable, of, throwError } from 'rxjs';
import { map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { tableConfig } from '@bgap/crud-gql/backend';
import {
  validateCart,
  validateGetGroupCurrency,
  validateGroupProduct,
  validateOrder,
  validateUnit,
} from '@bgap/shared/data-validators';
import {
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
} from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';

import { incrementOrderNum } from '../../database';
import { OrderResolverDeps } from './utils';
import { toFixed2Number, calculateOrderSumPrice } from '@bgap/shared/utils';
import { validateUnitProduct } from '@bgap/shared/data-validators';

const UNIT_TABLE_NAME = tableConfig.Unit.TableName;

export const createOrderFromCart = (userId: string, cartId: string) => (
  deps: OrderResolverDeps,
) => {
  return of('START').pipe(
    switchMap(() =>
      getCart(cartId)(deps).pipe(
        // CART.USERID CHECK
        // pipeDebug('### CART'),
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
      getUnit(cart.unitId)(deps).pipe(
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
      getGroupCurrency(props.unit.groupId)(deps).pipe(
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
        userId,
        currency: props.currency,
        cartItems: props.cart.items,
      })(deps).pipe(map(items => ({ ...props, items }))),
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
      createOrderInDb(props.orderInput)(deps).pipe(
        map(x => ({ ...props, orderId: x.id as string })),
      ),
    ),
    // Remove the cart from the db after the order has been created successfully
    switchMap(props =>
      deps.crudSdk
        .DeleteCart({ input: { id: props.cart.id } })
        .pipe(mapTo(props.orderId)),
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
  paymentMode: CrudApi.PaymentMode;
  items: CrudApi.OrderItemInput[];
  place: CrudApi.Place | null | undefined;
}): CrudApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    archived: false,
    orderNum,
    paymentMode,
    // created: DateTime.utc().toMillis(),
    items,
    // TODO: do we need this?? statusLog: createStatusLog(userId),
    statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPrice(items),
    place,
    unitId,
    // If payment mode is inapp set the state to NONE (because need payment first), otherwise set to placed
    // status: CrudApi.OrderStatus.NONE,
  };
};

const getOrderItems = ({
  userId,
  cartItems,
  currency,
}: {
  userId: string;
  cartItems: CrudApi.OrderItem[];
  currency: string;
}) => (deps: OrderResolverDeps): Observable<CrudApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getUnitProduct(cartItem.productId)(deps).pipe(
        switchMap(unitProduct =>
          getGroupProduct(unitProduct.parentId)(deps).pipe(
            map(groupProduct =>
              convertCartOrderItemToOrderItem({
                userId,
                cartItem,
                currency,
                laneId: unitProduct.laneId,
                tax: groupProduct.tax,
              }),
            ),
          ),
        ),
      ),
    ),
  );
};

const convertCartOrderItemToOrderItem = ({
  userId,
  cartItem,
  currency,
  laneId,
  tax,
}: {
  userId: string;
  cartItem: CrudApi.OrderItem;
  currency: string;
  laneId: string | null | undefined;
  tax: number;
}): CrudApi.OrderItemInput => {
  return {
    productName: cartItem.productName,
    priceShown: {
      currency,
      pricePerUnit: cartItem.priceShown.pricePerUnit,
      priceSum: toFixed2Number(
        cartItem.priceShown.pricePerUnit * cartItem.quantity,
      ),
      tax,
      taxSum: toFixed2Number(
        cartItem.priceShown.pricePerUnit * cartItem.quantity * (tax / 100),
      ),
    },
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    variantId: cartItem.variantId,
    variantName: cartItem.variantName,
    statusLog: createStatusLog(userId),
    laneId,
    allergens: cartItem.allergens,
    configSets: cartItem.configSets,
  };
};

const getUnitProduct = (productId: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetUnitProduct({ id: productId })).pipe(
    switchMap(validateUnitProduct),
  );
const getGroupProduct = (productId: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetGroupProduct({ id: productId })).pipe(
    switchMap(validateGroupProduct),
  );

const createStatusLog = (
  userId: string,
  status: CrudApi.OrderStatus = CrudApi.OrderStatus.none,
): Array<CrudApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

// TODO: get staff id from somewhere
// const getStaffId = async (unitId: string): Promise<string> => {
//   return Promise.resolve('staff_ID');
// };
const createOrderInDb = (input: CrudApi.CreateOrderInput) => (
  deps: OrderResolverDeps,
) => from(deps.crudSdk.CreateOrder({ input })).pipe(switchMap(validateOrder));

const getUnit = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetUnit({ id }, { fetchPolicy: 'no-cache' })).pipe(
    switchMap(validateUnit),
  );

const getCart = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetCart({ id }, { fetchPolicy: 'no-cache' })).pipe(
    switchMap(validateCart),
  );

const getGroupCurrency = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetGroupCurrency({ id }, { fetchPolicy: 'no-cache' })).pipe(
    switchMap(validateGetGroupCurrency),
    map(x => x.currency),
  );

const getNextOrderNum = (tableName: string) => ({
  unitId,
  place,
}: {
  unitId: string;
  place: CrudApi.Place | undefined | null;
}): Observable<string> => {
  return incrementOrderNum(tableName)(unitId).pipe(
    mergeMap(lastOrderNum =>
      iif(
        () => !!lastOrderNum,
        of(lastOrderNum),
        of(Math.floor(Math.random() * 10)), // In case of the lastOrderNum is missing get a random number between 0-99
      ),
    ),
    map(x => (x || 1).toString().padStart(2, '0')),
    map(num => (place ? `${place.table}${place.seat}${num}` : num)),
  );
};
