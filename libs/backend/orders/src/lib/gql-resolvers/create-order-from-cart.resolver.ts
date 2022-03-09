import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
  calculateOrderSumPriceRounded,
  PaymentStatus,
} from '@bgap/crud-gql/api';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';
import {
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import { DateTime } from 'luxon';
import { combineLatest, from, iif, Observable, of, throwError } from 'rxjs';
import { tap, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';
import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import {
  getGroupProduct,
  getUnitProduct,
  getChainProduct,
  OrderResolverDeps,
} from './utils';
import { addPackagingFeeToOrder } from './handle-packaging-fee';
import { hasSimplifiedOrder } from './order-resolvers';
import { addServiceFeeToOrder } from './handle-service-fee';

const toOrderInputFormat = ({
  userId,
  unit,
  orderNum,
  paymentMode,
  items,
  place,
  orderMode,
  servingMode,
}: {
  userId: string;
  unit: CrudApi.Unit;
  orderNum: string;
  paymentMode: CrudApi.PaymentMode;
  items: CrudApi.OrderItemInput[];
  place: CrudApi.Place | null | undefined;
  orderMode: CrudApi.OrderMode;
  servingMode: CrudApi.ServingMode;
}): CrudApi.CreateOrderInput => {
  return pipe(calculateOrderSumPriceRounded(items), sumPrice => ({
    userId,
    takeAway: false,
    archived: false,
    orderNum,
    paymentMode,
    items,
    statusLog: createStatusLog(userId),
    sumPriceShown: sumPrice,
    place,
    unitId: unit.id,
    transactionStatus: PaymentStatus.waiting_for_payment,
    orderMode,
    servingMode,
    orderPolicy: unit.orderPolicy,
    serviceFeePolicy: unit.serviceFeePolicy,
    ratingPolicies: unit.ratingPolicies,
    tipPolicy: unit.tipPolicy,
    soldOutVisibilityPolicy: unit.soldOutVisibilityPolicy,
  }));
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
        getUnitProduct(deps.crudSdk)(cartItem.productId).pipe(
          switchMap(unitProduct =>
            getGroupProduct(deps.crudSdk)(unitProduct.parentId).pipe(
              switchMap(groupProduct =>
                getChainProduct(deps.crudSdk)(groupProduct.parentId).pipe(
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
    throwIfEmptyValue<string>(`Group currency is missing for ${id}`),
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
      throwIfEmptyValue<CrudApi.Cart>(`Cart is missing: ${cartId}`),
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
        getNextOrderNum(deps.unitTableName)({
          unitId: props.unit.id,
          place: props.cart.place,
        }).pipe(map(orderNum => ({ ...props, orderNum }))),
      ),
    );

    const calc2 = calc1.pipe(
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
          unit: props.unit,
          orderNum: props.orderNum,
          paymentMode: props.cart.paymentMode as CrudApi.PaymentMode,
          items: props.items,
          place: props.cart.place,
          orderMode: CrudApi.OrderMode.instant, // Currenty this is a FIXED value
          servingMode: props.cart.servingMode || CrudApi.ServingMode.inplace, // should NOT use default Serving mode if ALL the carts have servingMode fields (when it will be required in the schema) (handled in #1835)
        }),
      })),
      // Handle packaging fee - only in takeaway mode
      switchMap(props =>
        (props.cart.version ?? 0) >= 1 &&
        props.cart.servingMode === CrudApi.ServingMode.takeaway
          ? pipe(
              addPackagingFeeToOrder(deps.crudSdk)(
                props.orderInput,
                props.currency,
                props.unit.packagingTaxPercentage,
              ),
              map(orderInput => ({
                ...props,
                orderInput,
              })),
            )
          : of(props),
      ),
      // Handle service fee  - not in takeaway mode
      map(props =>
        (props.cart.version ?? 0) >= 1 &&
        props.orderInput.servingMode === CrudApi.ServingMode.takeaway
          ? props
          : {
              ...props,
              orderInput: addServiceFeeToOrder(props.orderInput, props.unit),
            },
      ),
    );

    return calc2.pipe(
      // Archive the order immediately if the unit has simplified order policy
      map(props => ({
        ...props,
        orderInput: {
          ...props.orderInput,
          archived: hasSimplifiedOrder(props.unit),
        },
      })),
      // Place order into the DB
      switchMap(props =>
        createOrderInDb(props.orderInput)(deps).pipe(
          map(newOrder => ({
            ...props,
            newOrderId: newOrder?.id,
          })),
        ),
      ),
      switchMap(props =>
        deps.crudSdk
          .DeleteCart({ input: { id: props.cart.id } })
          .pipe(mapTo(props)),
      ),
      // Push the order to rkeeper if the unit is backed by rkeeper
      tap(x =>
        console.debug(
          'Props submitted to rkeeper check:',
          JSON.stringify(x, null, 2),
        ),
      ),
      switchMap(props =>
        (props.unit.pos?.type === CrudApi.PosType.rkeeper
          ? sendRkeeperOrder({
              currentTimeISOString: deps.currentTimeISOString,
              axiosInstance: deps.axiosInstance,
            })(props.unit, props.orderInput)
          : of({})
        ).pipe(
          map(rkeeperResult => ({
            ...props,
            rkeeperResult,
          })),
        ),
      ),
      map(props => props.newOrderId),
    );
  };
