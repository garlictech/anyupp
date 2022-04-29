import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { flow } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

export interface StuckOrdersCleanupDeps {
  sdk: CrudApi.CrudSdk;
  now: () => number;
  timeStamp: (dateString: string) => number;
}

export const stuckOrderCleanupHandler = (deps: StuckOrdersCleanupDeps) =>
  getAllPaginatedData(deps.sdk.SearchOrders, {
    query: {
      filter: { and: [{ currentStatus: { eq: CrudApi.OrderStatus.none } }] },
    },
  }).pipe(
    filterNullishGraphqlListWithDefault<CrudApi.Order>([]),
    switchMap(
      flow(
        R.filter(
          (order: CrudApi.Order) =>
            deps.now() - deps.timeStamp(order.updatedAt) > 1000 * 60 * 10,
        ),
        R.map((order: CrudApi.Order) =>
          deps.sdk.UpdateOrder({
            input: {
              id: order.id,
              currentStatus: CrudApi.OrderStatus.failed,
              statusLog: [
                ...order.statusLog,
                {
                  userId: 'blocked-order-lambda',
                  ts: deps.now(),
                  status: CrudApi.OrderStatus.failed,
                },
              ],
            },
          }),
        ),
        res => (R.isEmpty(res) ? of([]) : forkJoin(res)),
      ),
    ),
    tap(res => console.log(`Handled ${res.length} stuck orders.`)),
  );
