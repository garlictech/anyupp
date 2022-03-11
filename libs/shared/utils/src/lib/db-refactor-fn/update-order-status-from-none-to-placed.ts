import { cloneDeep } from 'lodash/fp';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { OrderResolverDeps } from '@bgap/backend/orders';
import * as CrudApi from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '../fn';

export const updateOrderStatusFromNoneToPlaced =
  (deps: OrderResolverDeps) => (orderId: string, adminUserId: string) =>
    from(
      deps.crudSdk.GetOrder({
        id: orderId,
      }),
    ).pipe(
      throwIfEmptyValue<CrudApi.Order>(),
      switchMap(order => {
        const _orderItems = cloneDeep(order.items);
        _orderItems.forEach(item => {
          // Update only none item status to placed!!!
          if (
            CrudApi.currentStatus(item.statusLog) === CrudApi.OrderStatus.none
          ) {
            item.statusLog.push({
              status: CrudApi.OrderStatus.placed,
              ts: deps.timestamp(),
              userId: adminUserId,
            });
          }
        });

        return deps.crudSdk.UpdateOrder({
          input: {
            id: orderId,
            items: _orderItems,
            statusLog: [
              {
                status: CrudApi.OrderStatus.placed,
                ts: deps.timestamp(),
                userId: adminUserId,
              },
            ],
          },
        });
      }),
    );
