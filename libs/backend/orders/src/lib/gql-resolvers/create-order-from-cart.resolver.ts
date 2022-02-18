import * as R from 'ramda';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  calculateOrderItemPriceRounded,
  calculateOrderItemSumPriceRounded,
  calculateOrderSumPriceRounded,
  PaymentStatus,
} from '@bgap/crud-gql/api';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';
import { DateTime } from 'luxon';
import { forkJoin, from, of } from 'rxjs';
import { map, mapTo, catchError } from 'rxjs/operators';
import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import { OrderResolverDeps, getAllParentsOfUnitProduct } from './utils';
import { hasSimplifiedOrder } from './order-resolvers';
import { addServiceFeeToOrder } from './handle-service-fee';
import * as E from 'fp-ts/lib/Either';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { addPackagingFeeToOrder } from './handle-packaging-fee';

export const convertCartOrderItemToOrderItem = ({
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

const createStatusLog = (
  userId: string,
  status: CrudApi.OrderStatus = CrudApi.OrderStatus.none,
): Array<CrudApi.StatusLogInput> => [
  { userId, status, ts: DateTime.utc().toMillis() },
];

const createOrderInDb =
  (input: CrudApi.CreateOrderInput) => (deps: OrderResolverDeps) =>
    from(deps.crudSdk.CreateOrder({ input }));

export const getCart =
  (deps: OrderResolverDeps) =>
  (cartId: string): OE.ObservableEither<string, CrudApi.Cart> =>
    pipe(
      deps.crudSdk.GetCart({ id: cartId }),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.Cart | undefined | null
        >,
      OE.map(x => x as CrudApi.Cart),
      // Validate cart
      OE.chain(
        OE.fromPredicate(
          R.complement(R.isNil),
          () => `Cart ${cartId} is missing`,
        ),
      ),
      OE.chain(
        OE.fromPredicate(
          cart => cart.userId === deps.userId,
          cart => `User ID-s mismatch (${deps.userId} <-> ${cart.userId})`,
        ),
      ),
    );

export interface CalculationState_UnitAdded {
  cart: CrudApi.Cart;
  unit: CrudApi.Unit;
}

export const getUnit =
  (deps: OrderResolverDeps) =>
  (
    cart: CrudApi.Cart,
  ): OE.ObservableEither<string, CalculationState_UnitAdded> =>
    pipe(
      deps.crudSdk.GetUnit({ id: cart.unitId }),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.Unit | undefined | null
        >,
      // Unit exists?
      OE.chain(
        OE.fromPredicate(
          R.complement(R.isNil),
          () =>
            `Unit ${cart.unitId} in the cart cannot be fetched from the database.`,
        ),
      ),
      OE.map(x => x as CrudApi.Unit),
      // Does the unit accept order?
      OE.chain(
        OE.fromPredicate(
          unit => unit.isAcceptingOrders,
          () => `Unit does not accept orders`,
        ),
      ),
      // Payment method is not provided: allowed in afterpay only
      OE.chain(
        OE.fromPredicate(
          unit =>
            !(
              !cart.paymentMode &&
              unit.orderPaymentPolicy !== CrudApi.OrderPaymentPolicy.afterpay
            ),
          () =>
            'Payment mode is not provided in the cart, and the unit does not accept afterpay.',
        ),
      ),
      OE.map(unit => ({
        cart,
        unit,
      })),
    );

export interface CalculationState_GroupCurrencyAdded {
  cart: CrudApi.Cart;
  unit: CrudApi.Unit;
  groupCurrency: string;
}

export const getGroupCurrency =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_GroupCurrencyAdded> =>
    pipe(
      deps.crudSdk.GetGroupCurrency({ id: inputState.unit.groupId }),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          string | undefined | null
        >,
      OE.chain(
        OE.fromPredicate(
          groupCurrency => !!groupCurrency,
          () =>
            `Group ${inputState.unit.groupId} cannot be fetched from the database.`,
        ),
      ),
      OE.map(groupCurrency => groupCurrency as string),
      OE.map(groupCurrency => ({
        ...inputState,
        groupCurrency,
      })),
    );

export interface CalculationState_OrderNumAdded {
  cart: CrudApi.Cart;
  unit: CrudApi.Unit;
  groupCurrency: string;
  orderNum: string;
}

export const getNextOrderNum =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_GroupCurrencyAdded,
  ): OE.ObservableEither<string, CalculationState_OrderNumAdded> =>
    pipe(
      incrementOrderNum(deps.unitTableName)(inputState.unit.id),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          number | undefined | null
        >,
      OE.map(x => x as number),
      OE.map(lastOrderNum => lastOrderNum ?? Math.floor(deps.random() * 10)),
      OE.map(x => (x || 1).toString().padStart(2, '0')),
      OE.map(num =>
        inputState.cart.place
          ? `${inputState.cart.place.table}${inputState.cart.place.seat}${num}`
          : num,
      ),
      OE.map(orderNum => ({
        ...inputState,
        orderNum,
      })),
    );

export interface CalculationState_OrderInputAdded {
  cart: CrudApi.Cart;
  unit: CrudApi.Unit;
  groupCurrency: string;
  orderNum: string;
  orderInput: CrudApi.CreateOrderInput;
}

export const getOrderInput =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_OrderNumAdded,
  ): OE.ObservableEither<string, CalculationState_OrderInputAdded> =>
    pipe(
      inputState.cart.items.map(cartItem =>
        pipe(
          getAllParentsOfUnitProduct(deps.crudSdk)(cartItem.productId),
          OE.map(state => ({ ...state, cartItem })),
        ),
      ),
      x => forkJoin(x),
      map(A.array.sequence(E.either)),
      OE.map(
        R.map(state =>
          convertCartOrderItemToOrderItem({
            userId: inputState.cart.userId,
            cartItem: state.cartItem,
            currency: inputState.groupCurrency,
            laneId: state.unitProduct.laneId,
            tax: getTax(
              inputState.cart.servingMode === CrudApi.ServingMode.takeaway,
              state.groupProduct,
            ),
            productType: state.chainProduct.productType,
            externalId: state.unitProduct.externalId,
          }),
        ),
      ),

      OE.map(orderItems => ({
        userId: deps.userId,
        takeAway: false,
        archived: false,
        orderNum: inputState.orderNum,
        paymentMode: inputState.cart.paymentMode,
        items: orderItems,
        statusLog: createStatusLog(deps.userId),
        sumPriceShown: calculateOrderSumPriceRounded(orderItems),
        place: inputState.cart.place,
        unitId: inputState.cart.unitId,
        transactionStatus: PaymentStatus.waiting_for_payment,
        orderMode: inputState.cart.orderMode || CrudApi.OrderMode.instant,
        servingMode: inputState.cart.servingMode || CrudApi.ServingMode.inplace,
        orderPolicy: inputState.unit.orderPolicy,
        serviceFeePolicy: inputState.unit.serviceFeePolicy,
        ratingPolicies: inputState.unit.ratingPolicies,
        tipPolicy: inputState.unit.tipPolicy,
        soldOutVisibilityPolicy: inputState.unit.soldOutVisibilityPolicy,
      })),
      OE.map(orderInput => ({
        ...inputState,
        orderInput,
      })),
    );

export const handlePackagingFee =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_OrderInputAdded,
  ): OE.ObservableEither<string, CalculationState_OrderInputAdded> =>
    pipe(
      inputState.cart.servingMode === CrudApi.ServingMode.takeaway
        ? pipe(
            addPackagingFeeToOrder(deps.crudSdk)(
              inputState.orderInput,
              inputState.groupCurrency,
              inputState.unit.packagingTaxPercentage,
            ),
            x => x,
            OE.map(orderInput => ({
              ...inputState,
              orderInput,
            })),
          )
        : OE.of<string, CalculationState_OrderInputAdded>(inputState),
    );

export const handleServiceFee = (
  inputState: CalculationState_OrderInputAdded,
): OE.ObservableEither<string, CalculationState_OrderInputAdded> =>
  pipe(
    addServiceFeeToOrder(inputState.orderInput, inputState.unit),
    orderInput => ({
      ...inputState,
      orderInput,
    }),
    x => OE.of<string, CalculationState_OrderInputAdded>(x),
  );

export const handleRkeeperOrder =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_OrderInputAdded,
  ): OE.ObservableEither<string, CalculationState_OrderInputAdded> =>
    pipe(
      inputState.unit.pos?.type === CrudApi.PosType.rkeeper
        ? sendRkeeperOrder({
            currentTime: deps.currentTime,
            axiosInstance: deps.axiosInstance,
          })(inputState.unit, inputState.orderInput)
        : of({}),
      mapTo(inputState),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CalculationState_OrderInputAdded
        >,
    );

export const handleSimplifiedOrders = (
  inputState: CalculationState_OrderInputAdded,
): OE.ObservableEither<string, CalculationState_OrderInputAdded> =>
  pipe(
    {
      ...inputState,
      orderInput: {
        ...inputState.orderInput,
        // Archive the order immediately if the unit has simplified order policy
        archived: hasSimplifiedOrder(inputState.unit),
      },
    },
    x => OE.of<string, CalculationState_OrderInputAdded>(x),
  );

export const placeOrder =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_OrderInputAdded,
  ): OE.ObservableEither<string, string> =>
    pipe(
      createOrderInDb(inputState.orderInput)(deps),
      x => OE.tryCatch(x) as OE.ObservableEither<string, CrudApi.Order>,
      OE.chain(
        OE.fromPredicate(
          R.complement(R.isNil),
          () => 'Order cannot be placed, unknown error',
        ),
      ),
      OE.chain(order =>
        deps.crudSdk.DeleteCart({ input: { id: inputState.cart.id } }).pipe(
          catchError(err => {
            console.error(
              'Error during deleting cart, but placing order was successful, so we keep going:',
              err,
            );
            return of(order.id);
          }),
          mapTo(order.id),
        ),
      ),
    );

export interface CalculationState_WithCart {
  cart: CrudApi.Cart;
  userId: string;
}

export const validateCart = (
  cartInput: CrudApi.Cart | undefined,
  userId: string,
): E.Either<string, CalculationState_WithCart> =>
  pipe(
    cartInput,
    E.fromNullable(`Cart is missing`),
    E.chain(
      E.fromPredicate(
        cart => cart.userId === userId,
        () => 'User ID-s mismatch',
      ),
    ),
    E.map(cart => ({
      userId,
      cart,
    })),
  );

export const validateUnitPolicies = (
  inputState: CalculationState_WithCart,
  unit: CrudApi.Unit | undefined,
): E.Either<string, CalculationState_UnitAdded> =>
  pipe(
    inputState,
    E.fromPredicate(
      () => !!unit,
      () =>
        `Unit ${inputState.cart.unitId} in the cart cannot be fetched from the database.`,
    ),
    E.map(state => ({
      ...state,
      unit: unit as CrudApi.Unit,
    })),
    E.chain(
      E.fromPredicate(
        state => !state.unit.isAcceptingOrders,
        () => `Unit does not acept orders`,
      ),
    ),
    //E.chain(E.fromPredicate(() => cart.paymentMode && unit.orderPaymentPolicy !== CrudApi.OrderPaymentPolicy.afterpay,
    //'Payment mode is not provided in the cart, and the unit does not accept afterpay.')
  );

export const createOrderFromCart =
  (cartId: string) =>
  (deps: OrderResolverDeps): OE.ObservableEither<string, string> => {
    console.debug(
      `Handling createOrderFromCart: cartId=${cartId}, userId=${deps.userId}`,
    );
    // split a long stream to help the type checker
    const calc1 = getCart(deps)(cartId).pipe(
      OE.chain(getUnit(deps)),
      OE.chain(getGroupCurrency(deps)),
      OE.chain(getNextOrderNum(deps)),
      OE.chain(getOrderInput(deps)),
      OE.chain(handlePackagingFee(deps)),
      OE.chain(handleServiceFee),
      OE.chain(handleRkeeperOrder(deps)),
    );

    return calc1.pipe(
      OE.chain(handleSimplifiedOrders),
      OE.chain(placeOrder(deps)),
    );
  };
