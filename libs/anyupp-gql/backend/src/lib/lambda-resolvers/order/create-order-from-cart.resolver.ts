import { DateTime } from 'luxon';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { toFixed2Number } from '../../utils/number.utils';

import {
  EOrderStatus,
  IOrderItem,
  IPlace,
  IUnitProduct,
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
import { OrderResolverDeps } from './utils';
import { PaymentMode } from '@bgap/anyupp-gql/api';

export const createOrderFromCart = ({
  userId,
  cartId,
}: {
  userId: string;
  cartId: string;
}) => (deps: OrderResolverDeps) => {
  return getCart(cartId)(deps).pipe(
    switchMap(cart =>
      cart.userId === userId ? of(cart) : throwError(getCartIsMissingError()),
    ),
    switchMap(cart =>
      getUnit(cart.unitId)(deps).pipe(map(unit => ({ cart, unit }))),
    ),
    switchMap(props =>
      getGroupCurrency(props.unit?.groupId)(deps).pipe(
        map(currency => ({ ...props, currency })),
      ),
    ),
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
      from(deps.crudSdk.DeleteCart({ input: { id: props.cart.id } })).pipe(
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
  paymentMode: PaymentMode;
  items: CrudApi.OrderItemInput[];
  place?: IPlace;
}): CrudApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    paymentMode,
    // created: DateTime.utc().toMillis(),
    items: items,
    // TODO: do we need this?? statusLog: createStatusLog(userId),
    statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPrice(items),
    place: place,
    unitId,
  };
};

const getOrderItems = ({
  userId,
  cartItems,
  currency,
}: {
  userId: string;
  cartItems: IOrderItem[];
  currency: string;
}) => (deps: OrderResolverDeps): Observable<CrudApi.OrderItemInput[]> => {
  return combineLatest(
    cartItems.map(cartItem =>
      getLaneIdForCartItem(cartItem.productId)(deps).pipe(
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

const getLaneIdForCartItem = (productId: string) => (
  deps: OrderResolverDeps,
): Observable<string | undefined> => {
  return getUnitProduct(productId)(deps).pipe(map(product => product.laneId));
};

const getUnitProduct = (productId: string) => (
  deps: OrderResolverDeps,
): Observable<IUnitProduct> =>
  from(deps.crudSdk.GetUnitProduct({ id: productId })).pipe(
    switchMap(validateUnitProduct),
  );

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
const createOrderInDb = (input: CrudApi.CreateOrderInput) => (
  deps: OrderResolverDeps,
) => from(deps.crudSdk.CreateOrder({ input })).pipe(switchMap(validateOrder));

const getUnit = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetUnit({ id })).pipe(switchMap(validateUnit));

const getCart = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetCart({ id })).pipe(switchMap(validateCart));

const getGroupCurrency = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetGroupCurrency({ id })).pipe(
    switchMap(validateGetGroupCurrency),
  );
