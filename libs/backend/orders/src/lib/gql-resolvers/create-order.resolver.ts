import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import { DateTime } from 'luxon';
import { from, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import { incrementOrderNum } from '@bgap/anyupp-backend-lib';
import {
  CreateOrderInput,
  Order,
  OrderPaymentPolicy,
  OrderStatus,
  PosType,
  ServingMode,
  Unit,
} from '@bgap/domain';
import { sendRkeeperOrder } from '@bgap/rkeeper-api';
import { oeTryCatch } from '@bgap/shared/utils';

import { OrderResolverDeps } from './utils';

export interface CalculationState_UnitAdded {
  order: CreateOrderInput;
  unit: Unit;
}

export const getUnit =
  (deps: OrderResolverDeps) =>
  (
    order: CreateOrderInput,
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
              unit.orderPaymentPolicy !== OrderPaymentPolicy.afterpay
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
      OE.map(lastOrderNum => lastOrderNum ?? Math.floor(deps.random() * 100)),
      OE.map(x => (x || 1).toString().padStart(3, '0')),
      OE.map(orderNum => ({
        ...input,
        order: {
          ...input.order,
          orderNum,
        },
      })),
    );

export interface CalculationState_OrderAdded {
  order: Order;
  unit: Unit;
}

export const placeOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_OrderAdded> =>
    pipe(
      deps.currentTimeISOString(),
      time => ({
        Item: {
          ...input.order,
          id: input.order.id ?? deps.uuid(),
          createdAt: time,
          updatedAt: time,
          statusLog: [
            {
              userId: input.order.userId,
              status: OrderStatus.none,
              ts: DateTime.utc().toMillis(),
            },
          ],
          archived: false,
          takeAway: input.order.servingMode === ServingMode.takeaway,
          currentStatus: OrderStatus.none,
        },
        TableName: deps.orderTableName,
      }),
      params =>
        from(deps.docClient.put(params).promise()).pipe(mapTo(params.Item)),
      map(order => ({
        ...input,
        order,
      })),
      oeTryCatch,
    );

export const handleRkeeperOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CalculationState_UnitAdded,
  ): OE.ObservableEither<string, CalculationState_UnitAdded> =>
    pipe(
      of(input.unit.pos?.type === PosType.rkeeper).pipe(
        switchMap(isRKeeperPos =>
          isRKeeperPos
            ? sendRkeeperOrder({
                currentTimeISOString: deps.currentTimeISOString,
                axiosInstance: deps.axiosInstance,
                uuidGenerator: deps.uuid,
              })(input.unit, input.order)
            : of(null),
        ),
        map(sendOrderResponse => ({
          ...input,
          order: {
            ...input.order,
            ...(sendOrderResponse?.externalId && {
              externalId: sendOrderResponse.externalId,
            }),
            ...(sendOrderResponse?.visitId && {
              visitId: sendOrderResponse.visitId,
            }),
          },
        })),
      ),
      oeTryCatch,
    );

export const createOrder =
  (input: CreateOrderInput) =>
  (deps: OrderResolverDeps): Observable<Order> =>
    getUnit(deps)(input).pipe(
      OE.chain(getNextOrderNum(deps)),
      OE.chain(handleRkeeperOrder(deps)),
      OE.chain(placeOrder(deps)),
      OE.map(state => state.order),
      OE.fold(
        err => throwError(err),
        order => of(order),
      ),
    );
