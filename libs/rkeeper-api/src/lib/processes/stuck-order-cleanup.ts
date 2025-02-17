import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { flow } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { Order, OrderStatus } from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';

export interface StuckOrdersCleanupDeps {
  sdk: CrudSdk;
  now: () => number;
  timeStamp: (dateString: string) => number;
}

export const STUCK_ORDER_TIME_THRESHOLD = 1000 * 60 * 10;

export const stuckOrderCleanupHandler = (deps: StuckOrdersCleanupDeps) =>
  getAllPaginatedData(deps.sdk.SearchOrders, {
    query: {
      filter: { and: [{ currentStatus: { eq: OrderStatus.none } }] },
    },
  }).pipe(
    filterNullishGraphqlListWithDefault<Order>([]),
    switchMap(
      flow(
        R.filter(
          (order: Order) =>
            deps.now() - deps.timeStamp(order.updatedAt) >
            STUCK_ORDER_TIME_THRESHOLD,
        ),
        R.map((order: Order) =>
          deps.sdk.UpdateOrder({
            input: {
              id: order.id,
              currentStatus: OrderStatus.failed,
              archived: true,
              statusLog: [
                ...order.statusLog,
                {
                  userId: 'blocked-order-lambda',
                  ts: deps.now(),
                  status: OrderStatus.failed,
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
