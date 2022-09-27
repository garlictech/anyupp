import { pipe } from 'fp-ts/lib/function';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { shareReplay } from 'rxjs/operators';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { AxiosStatic } from 'axios';
import { DynamoDB } from 'aws-sdk';
import { CrudSdk } from '@bgap/crud-gql/api';
import {
  UnitProduct,
  CreateOrderInput,
  OrderPaymentPolicy,
} from '@bgap/domain';
import { oeTryCatch } from '@bgap/shared/utils';

import { OrderPolicy, Unit } from '@bgap/domain';

export const hasSimplifiedOrder = (unit: Unit): boolean =>
  !R.isNil(unit.orderPolicy) && unit.orderPolicy !== OrderPolicy.full;

export interface OrderResolverDeps {
  crudSdk: CrudSdk;
  orderTableName: string;
  unitTableName: string;
  currentTimeISOString: () => string;
  random: () => number;
  uuid: () => string;
  axiosInstance: AxiosStatic;
  docClient: DynamoDB.DocumentClient;
  userId: string;
}

const getUnitProductHelper = R.memoizeWith(
  (_sdk: CrudSdk, id: string) => id,
  (sdk: CrudSdk, id: string) =>
    pipe(
      sdk.GetUnitProduct({ id }),
      throwIfEmptyValue(`UnitProduct cannot be found: ${id}`),
      shareReplay(1),
    ),
);

export const getUnitProduct =
  (sdk: CrudSdk) =>
  (id: string): Observable<UnitProduct> =>
    getUnitProductHelper(sdk, id);

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
