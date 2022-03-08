import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import * as CrudApi from '@bgap/crud-gql/api';
import { OrderResolverDeps } from './utils';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';
import { from, of } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { oeTryCatch } from '@bgap/shared/utils';

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
      oeTryCatch,
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
            'Payment mode is not provided in the order, and the unit does not accept afterpay.',
        ),
      ),
      OE.map(unit => ({
        order,
        unit,
      })),
    );

export const getNextOrderNum =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_UnitAdded> =>
    pipe(
      incrementOrderNum(deps.unitTableName)(input.unit.id),
      oeTryCatch,
      OE.map(x => x as NonNullable<typeof x>),
      OE.map(lastOrderNum => lastOrderNum ?? Math.floor(deps.random() * 10)),
      OE.map(x => (x || 1).toString().padStart(2, '0')),
      OE.map(num =>
        input.order.place
          ? `${input.order.place.table}${input.order.place.seat}${num}`
          : num,
      ),
      OE.map(orderNum => ({
        ...input,
        order: {
          ...input.order,
          orderNum,
        },
      })),
    );

export const handleRkeeperOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_UnitAdded> =>
    pipe(
      input.unit.pos?.type === CrudApi.PosType.rkeeper
        ? sendRkeeperOrder({
            currentTime: deps.currentTime,
            axiosInstance: deps.axiosInstance,
          })(input.unit, input.order)
        : of({}),
      mapTo(input),
      oeTryCatch,
    );

export const placeOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CrudApi.Order> =>
    pipe(
      {
        Item: {
          id: deps.uuid(),
          ...input.order,
        },
        TableName: deps.orderTableName,
      },
      params => from(deps.docClient.put(params).promise()),
      map(x => x.Attributes as CrudApi.Order),
      oeTryCatch,
    );

export const createOrder =
  (input: CrudApi.CreateOrderInput) =>
  (deps: OrderResolverDeps): OE.ObservableEither<string, CrudApi.Order> => {
    return getUnit(deps)(input).pipe(
      OE.chain(getNextOrderNum(deps)),
      OE.chain(placeOrder(deps)),
      OE.chain(handleRkeeperOrder(deps)),
    );
  };
