import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import * as CrudApi from '@bgap/crud-gql/api';
import { OrderResolverDeps } from './utils';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';

export interface CalculationState_UnitAdded {
  order: CrudApi.CreateOrderInput;
  unit: CrudApi.Unit;
}

export const getUnit =
  (deps: OrderResolverDeps) =>
  (
    order: CrudApi.CreateOrderInput,
  ): OE.ObservableEither<string, CalculationState_UnitAdded> =>
    pipe(
      deps.crudSdk.GetUnit({ id: order.unitId }),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          CrudApi.Unit | undefined | null
        >,
      // Unit exists?
      OE.chain(
        OE.fromPredicate(
          x => !!x,
          () =>
            `Unit ${order.unitId} in the cart cannot be fetched from the database.`,
        ),
      ),
      OE.map(x => x as NonNullable<typeof x>),
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
              !order.paymentMode &&
              unit.orderPaymentPolicy !== CrudApi.OrderPaymentPolicy.afterpay
            ),
          () =>
            'Payment mode is not provided in the cart, and the unit does not accept afterpay.',
        ),
      ),
      OE.map(unit => ({
        order,
        unit,
      })),
    );

export interface CalculationState_OrderNumAdded {
  orderNum: string;
  order: CrudApi.CreateOrderInput;
  unit: CrudApi.Unit;
}

export const getNextOrderNum =
  (deps: OrderResolverDeps) =>
  (
    inputState: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_OrderNumAdded> =>
    pipe(
      incrementOrderNum(deps.unitTableName)(inputState.unit.id),
      x =>
        OE.tryCatch(x) as OE.ObservableEither<
          string,
          number | undefined | null
        >,
      OE.map(x => x as NonNullable<typeof x>),
      OE.map(lastOrderNum => lastOrderNum ?? Math.floor(deps.random() * 10)),
      OE.map(x => (x || 1).toString().padStart(2, '0')),
      OE.map(num =>
        input.place ? `${input.place.table}${input.place.seat}${num}` : num,
      ),
      OE.map(orderNum => ({
        ..inputState,
        orderNum,
      })),
    );

export const handleRkeeperOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_OrderNumAdded,
  ): OE.ObservableEither<string, CalculationState_OrderNumAdded> =>
    pipe(
      input.unit.pos?.type === CrudApi.PosType.rkeeper
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
export const createOrder =
  (input: CrudApi.CreateOrderInput) =>
  (deps: OrderResolverDeps): OE.ObservableEither<string, string> => {
    return getUnit(deps)(input).pipe(
    OE.chain(getNextOrderNum(deps)),
      OE.chain(handleRkeeperOrder(deps)),
      OE.chain(placeOrder(deps)),
    );
  };
