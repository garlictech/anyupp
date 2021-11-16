import * as CrudApi from '@bgap/crud-gql/api';
import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
  calculateOrderSumPriceRounded,
  PaymentStatus,
} from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import {
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import { DateTime } from 'luxon';
import { combineLatest, from, iif, Observable, of, throwError } from 'rxjs';
import { map, mapTo, mergeMap, switchMap, tap } from 'rxjs/operators';
import { incrementOrderNum } from '../../database';
import { OrderResolverDeps } from './utils';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';

const UNIT_TABLE_NAME = tableConfig.Unit.TableName;

const getUnitProduct = (productId: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetUnitProduct({ id: productId }));

const getGroupProduct = (productId: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetGroupProduct({ id: productId }));

const getChainProduct = (productId: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetChainProduct({ id: productId }));

const toOrderInputFormat = ({
  userId,
  unitId,
  orderNum,
  paymentMode,
  items,
  place,
  orderMode,
  servingMode,
}: {
  userId: string;
  unitId: string;
  orderNum: string;
  paymentMode: CrudApi.PaymentMode;
  items: CrudApi.OrderItemInput[];
  place: CrudApi.Place | null | undefined;
  orderMode: CrudApi.OrderMode;
  servingMode: CrudApi.ServingMode;
}): CrudApi.CreateOrderInput => {
  return {
    userId,
    takeAway: false,
    archived: false,
    orderNum,
    paymentMode,
    items,
    statusLog: createStatusLog(userId),
    sumPriceShown: calculateOrderSumPriceRounded(items),
    place,
    unitId,
    transactionStatus: PaymentStatus.waiting_for_payment,
    // If payment mode is inapp set the state to NONE (because need payment first), otherwise set to placed
    // status: CrudApi.OrderStatus.NONE,
    orderMode,
    servingMode,
  };
};

const convertCartOrderItemToOrderItem = ({
  userId,
  cartItem,
  currency,
  laneId,
  tax,
  productType,
  externalId,
}: {
  userId: string;
  cartItem: CrudApi.OrderItem;
  currency: string;
  laneId: string | null | undefined;
  tax: number;
  productType: string;
  externalId?: CrudApi.Maybe<string>;
}): CrudApi.OrderItemInput => {
  const orderItemWithCorrectTaxAndCurrency: CrudApi.OrderItem = {
    ...cartItem,
    priceShown: { ...cartItem.priceShown, tax, currency },
  };
  return {
    productName: cartItem.productName,
    priceShown: calculateOrderItemPriceRounded(
      orderItemWithCorrectTaxAndCurrency,
    ),
    sumPriceShown: calculateOrderItemSumPriceRounded(
      orderItemWithCorrectTaxAndCurrency,
    ),
    productId: cartItem.productId,
    quantity: cartItem.quantity,
    variantId: cartItem.variantId,
    variantName: cartItem.variantName,
    statusLog: createStatusLog(userId),
    laneId,
    allergens: cartItem.allergens,
    configSets: cartItem.configSets,
    productType,
    externalId,
  };
};

const getTax = (
  takeaway: boolean,
  groupProduct: CrudApi.GroupProduct,
): number =>
  takeaway && groupProduct.takeawayTax
    ? groupProduct.takeawayTax
    : groupProduct.tax;

const getOrderItems =
  ({
    userId,
    cartItems,
    currency,
    takeaway,
  }: {
    userId: string;
    cartItems: CrudApi.OrderItem[];
    currency: string;
    takeaway: boolean;
  }) =>
  (deps: OrderResolverDeps): Observable<CrudApi.OrderItemInput[]> => {
    return combineLatest(
      cartItems.map(cartItem =>
        getUnitProduct(cartItem.productId)(deps).pipe(
          throwIfEmptyValue<CrudApi.UnitProduct>(),
          switchMap(unitProduct =>
            getGroupProduct(unitProduct.parentId)(deps).pipe(
              throwIfEmptyValue<CrudApi.GroupProduct>(),
              switchMap(groupProduct =>
                getChainProduct(groupProduct.parentId)(deps).pipe(
                  throwIfEmptyValue<CrudApi.ChainProduct>(),
                  map(chainProduct =>
                    convertCartOrderItemToOrderItem({
                      userId,
                      cartItem,
                      currency,
                      laneId: unitProduct.laneId,
                      tax: getTax(takeaway, groupProduct),
                      productType: chainProduct.productType,
                      externalId: unitProduct.externalId,
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  };

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
const createOrderInDb =
  (input: CrudApi.CreateOrderInput) => (deps: OrderResolverDeps) =>
    from(deps.crudSdk.CreateOrder({ input }));

const getUnit = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetUnit({ id }, { fetchPolicy: 'no-cache' }));

const getCart = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetCart({ id }, { fetchPolicy: 'no-cache' }));

const getGroupCurrency = (id: string) => (deps: OrderResolverDeps) =>
  from(deps.crudSdk.GetGroupCurrency({ id }, { fetchPolicy: 'no-cache' })).pipe(
    map(x => x?.currency),
    throwIfEmptyValue<string>(),
  );

const getNextOrderNum =
  (tableName: string) =>
  ({
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

const isTakeawayCart = (cart: CrudApi.Cart) =>
  cart.servingMode === CrudApi.ServingMode.takeaway;

export const createOrderFromCart =
  (cartId: string) =>
  (
    deps: OrderResolverDeps,
  ): ReturnType<CrudApi.CrudSdk['CreateOrderFromCart']> => {
    console.debug(
      `Handling createOrderFromCart: cartId=${cartId}, userId=${deps.userId}`,
    );
    // split a long stream to help the type checker
    const calc1 = getCart(cartId)(deps).pipe(
      throwIfEmptyValue<CrudApi.Cart>(),
      switchMap(cart =>
        cart.userId === deps.userId
          ? of(cart)
          : throwError(getCartIsMissingError()),
      ),
      switchMap(cart =>
        cart.paymentMode !== undefined
          ? of(cart)
          : throwError(missingParametersError('cart.paymentMode')),
      ),
      switchMap(cart =>
        // create catchError and custom error (Covered by #744)
        getUnit(cart.unitId)(deps).pipe(
          map(unit => ({ cart, unit })),
          // UNIT.IsAcceptingOrders CHECK
          switchMap(props =>
            props?.unit?.isAcceptingOrders
              ? of(props)
              : throwError(getUnitIsNotAcceptingOrdersError()),
          ),
        ),
      ),
      switchMap(props =>
        props?.unit && props?.cart
          ? of(props as { unit: CrudApi.Unit; cart: CrudApi.Cart })
          : throwError('Wrong data'),
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
    );

    return calc1.pipe(
      switchMap(props =>
        getOrderItems({
          userId: deps.userId,
          currency: props.currency,
          cartItems: props.cart.items,
          takeaway: isTakeawayCart(props.cart),
        })(deps).pipe(map(items => ({ ...props, items }))),
      ),
      map(props => ({
        ...props,
        orderInput: toOrderInputFormat({
          userId: deps.userId,
          unitId: props.cart.unitId,
          orderNum: props.orderNum,
          paymentMode: props.cart.paymentMode as CrudApi.PaymentMode,
          items: props.items,
          place: props.cart.place,
          orderMode: CrudApi.OrderMode.instant, // Currenty this is a FIXED value
          servingMode: props.cart.servingMode || CrudApi.ServingMode.inplace, // should NOT use default Serving mode if ALL the carts have servingMode fields (when it will be required in the schema) (handled in #1835)
        }),
      })),
      switchMap(props =>
        createOrderInDb(props.orderInput)(deps).pipe(
          switchMap(item =>
            combineLatest(
              deps.crudSdk.DeleteCart({ input: { id: props.cart.id } }),
              props.unit.pos?.type === CrudApi.PosType.rkeeper
                ? sendRkeeperOrder(props.unit, props.orderInput)
                : of({}),
            ).pipe(mapTo(item?.id)),
          ),
        ),
      ),
    );
  };
