/* eskint-disable @typescript-eslint/no-explicit-any */
import { oeTryCatch } from '@bgap/shared/utils';
import { MutationCallWaiterArgs, CallWaiterInput, Unit } from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { pipe } from 'fp-ts/lib/function';
import { throwError } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import * as R from 'ramda';
import { AxiosStatic } from 'axios';
import { callWaiter } from '@bgap/rkeeper-api';

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

export const waiterCallerResolver =
  (deps: WaiterCallerResolverDeps) =>
  (args: MutationCallWaiterArgs): ReturnType<CrudSdk['CallWaiter']> =>
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
      mapTo(true),
    );
