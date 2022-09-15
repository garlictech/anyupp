/* eslint-disable @typescript-eslint/no-explicit-any */
import { oeTryCatch } from '@bgap/shared/utils';
import { MutationCallWaiterArgs, CallWaiterInput, Unit } from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import { throwError } from 'rxjs';
import * as R from 'ramda';
import { sendOrderToRkeeperPOS } from '@bgap/rkeeper-api';
import { AxiosStatic } from 'axios';

export interface WaiterCallerResolverDeps {
  sdk: CrudSdk;
  currentTimeISOString: () => string;
  axiosInstance: AxiosStatic;
  uuidGenerator: () => string;
}

export const getUnit =
  (deps: WaiterCallerResolverDeps) => (args: CallWaiterInput) =>
    pipe(
      deps.sdk.GetUnit({ id: args.unitId }),
      oeTryCatch,
      OE.chain(
        OE.fromPredicate(
          unit => !!unit,
          () => 'unit_not_found',
        ),
      ),
      OE.map(unit => unit as Unit),
    );

export const callWaiter =
  (deps: WaiterCallerResolverDeps) => (unit: Unit, input: CallWaiterInput) =>
    pipe(
      {
        objectid: unit.externalId,
        remoteId: unit.externalId,
        order_type: 1,
        pay_type: 0,
        pay_online_type: 0,
        delivery_time: deps.currentTimeISOString().split('.')[0],
        client: {
          phone: unit.phone,
          email: unit.email,
          ln: 'Biborka',
        },
        order_number: parseInt(input.place.table) || 0,
        guest_label: parseInt(input.place?.seat) || 0,
        guest_name: input.guestLabel,
        remoteOrderId: deps.uuidGenerator(),
        order: {
          id: unit.pos?.rkeeper?.waiterOrderId,
          type: 'd',
          qnt: 1,
        },
      },
      order => sendOrderToRkeeperPOS(deps)(order, unit, deps.uuidGenerator()),
      oeTryCatch,
    );

export const waiterCallerResolver =
  (deps: WaiterCallerResolverDeps) =>
  (
    args: MutationCallWaiterArgs, //: ReturnType<CrudSdk['CallWaiter']> =>
  ) =>
    pipe(
      args.input,
      OE.fromPredicate(
        x => !R.isEmpty(x?.unitId),
        () => 'unit_id_required',
      ),
      OE.map(x => x as CallWaiterInput),
      OE.chain(getUnit(deps)),
      OE.chain(
        OE.fromPredicate(
          unit => !!unit.canCallWaiter,
          () => 'unit_cannot_call_waiter',
        ),
      ),
      OE.chain(
        OE.fromPredicate(
          unit => !!unit.pos?.rkeeper?.endpointUri,
          () => 'not_supported_pos',
        ),
      ),
      OE.chain(
        OE.fromPredicate(
          unit => !!unit.pos?.rkeeper?.waiterOrderId,
          () => 'rkeeper_waiter_caller_not_configured',
        ),
      ),
      OE.chain(
        OE.fromPredicate(
          unit => !!unit.externalId,
          () => 'rkeeper_external_id_not_configured',
        ),
      ),
      OE.chain(unit => callWaiter(deps)(unit, args.input as CallWaiterInput)),
      OE.getOrElse<string, any>(throwError),
      //
    );
// bejòn az unit ID
// hold le az unitot. Ha ninc sunit: "nincs unit"
// canCallwaiter? ha nem, "cannot call waiter"
// van rkeeper config? ha nincs, "nit supported POS"
// dobj be egy "ordert"
// itt termináld, nem várjuk meg a státuszt
