import * as CrudApi from '@bgap/crud-gql/api';
import { OrderResolverDeps } from './utils';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';

/*export const handleRkeeperOrder =
  (deps: OrderResolverDeps) =>
  (
    input: CrudApi.CreateOrderInput,
  ): OE.ObservableEither<string, boolean> =>
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
*/
export const createOrder =
  (_input: CrudApi.CreateOrderInput) =>
  (_deps: OrderResolverDeps): OE.ObservableEither<string, string> => {
    return OE.of('OK');
  };
