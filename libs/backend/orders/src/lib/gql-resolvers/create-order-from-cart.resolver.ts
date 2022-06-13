import { pipe } from 'fp-ts/lib/function';
import { DateTime } from 'luxon';
import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
  calculateOrderSumPriceRounded,
  CrudSdk,
  PaymentStatus,
} from '@bgap/crud-gql/api';
import {
  Cart,
  CreateOrderInput,
  GroupProduct,
  Maybe,
  OrderItem,
  OrderItemInput,
  OrderMode,
  OrderStatus,
  PaymentMode,
  Place,
  PosType,
  ProductType,
  ServingMode,
  StatusLogInput,
  Unit,
} from '@bgap/domain';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';
import {
  getCartIsMissingError,
  getUnitIsNotAcceptingOrdersError,
  missingParametersError,
  throwIfEmptyValue,
} from '@bgap/shared/utils';

import { addPackagingFeeToOrder } from './handle-packaging-fee';
import { addServiceFeeToOrder } from './handle-service-fee';
import { hasSimplifiedOrder } from './order-resolvers';
import {
  getChainProduct,
  getGroupProduct,
  getUnitProduct,
  OrderResolverDeps,
} from './utils';

const toOrderInputFormat = ({
  userId,
  unit,
  paymentMode,
  items,
  place,
  orderMode,
  servingMode,
  guestLabel,
}: {
  userId: string;
  unit: Unit;
  paymentMode: PaymentMode;
  items: OrderItemInput[];
  place: Place | null | undefined;
  orderMode: OrderMode;
  servingMode: ServingMode;
  guestLabel: string | null | undefined;
}): CreateOrderInput => {
  return pipe(calculateOrderSumPriceRounded(items), sumPrice => ({
    userId,
    takeAway: false,
    archived: false,
    paymentMode,
    items,
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
    guestLabel,
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
  cartItem: OrderItem;
  currency: string;
  laneId: string | null | undefined;
  tax: number;
  productType: ProductType;
  externalId?: Maybe<string>;
}): OrderItemInput => {
  const orderItemWithCorrectTaxAndCurrency: OrderItem = {
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

const getTax = (takeaway: boolean, groupProduct: GroupProduct): number =>
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
    cartItems: OrderItem[];
    currency: string;
    takeaway: boolean;
  }) =>
  (deps: OrderResolverDeps): Observable<OrderItemInput[]> => {
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
  status: OrderStatus = OrderStatus.none,
): Array<StatusLogInput> => [{ userId, status, ts: DateTime.utc().toMillis() }];

const createOrderInDb =
  (input: CreateOrderInput) => (deps: OrderResolverDeps) =>
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

const isTakeawayCart = (cart: Cart) =>
  cart.servingMode === ServingMode.takeaway;

export const createOrderFromCart =
  (cartId: string) =>
  (deps: OrderResolverDeps): ReturnType<CrudSdk['CreateOrderFromCart']> => {
    console.debug(
      `Handling createOrderFromCart: cartId=${cartId}, userId=${deps.userId}`,
    );
    // split a long stream to help the type checker
    const calc1 = getCart(cartId)(deps).pipe(
      throwIfEmptyValue<Cart>(`Cart is missing: ${cartId}`),
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
          ? of(props as { unit: Unit; cart: Cart })
          : throwError('Wrong data'),
      ),
      switchMap(props =>
        getGroupCurrency(props.unit.groupId)(deps).pipe(
          map(currency => ({ ...props, currency })),
        ),
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
          paymentMode: props.cart.paymentMode as PaymentMode,
          items: props.items,
          place: props.cart.place,
          orderMode: OrderMode.instant, // Currenty this is a FIXED value
          servingMode: props.cart.servingMode || ServingMode.inplace, // should NOT use default Serving mode if ALL the carts have servingMode fields (when it will be required in the schema) (handled in #1835)
          guestLabel: props.cart.guestLabel,
        }),
      })),
      // Handle packaging fee - only in takeaway mode
      switchMap(props =>
        (props.cart.version ?? 0) >= 1 &&
        props.cart.servingMode === ServingMode.takeaway
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
        props.orderInput.servingMode === ServingMode.takeaway
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
      // Push the order to rkeeper if the unit is backed by rkeeper
      switchMap(props =>
        (props.unit.pos?.type === PosType.rkeeper
          ? sendRkeeperOrder({
              currentTimeISOString: deps.currentTimeISOString,
              axiosInstance: deps.axiosInstance,
              uuidGenerator: deps.uuid,
            })(props.unit, props.orderInput)
          : of(undefined)
        ).pipe(
          map(externalId => ({
            ...props,
            orderInput: {
              ...props.orderInput,
              externalId,
              id: externalId,
            },
          })),
        ),
      ),
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
      map(props => props.newOrderId),
    );
  };
