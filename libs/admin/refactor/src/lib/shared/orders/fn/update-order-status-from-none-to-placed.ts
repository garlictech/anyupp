import { cloneDeep } from 'lodash/fp';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { currentStatus } from '@bgap/crud-gql/api';
import { Order, OrderStatus } from '@bgap/domain';
import { OrderHandlerDeps } from './utils';
import { throwIfEmptyValue } from '@bgap/shared/utils';

export const updateOrderStatusFromNoneToPlaced =
  (deps: OrderHandlerDeps) => (orderId: string, adminUserId: string) =>
    from(
      deps.crudSdk.GetOrder({
        id: orderId,
      }),
    ).pipe(
      throwIfEmptyValue<Order>(),
      switchMap(order => {
        const _orderItems = cloneDeep(order.items);
        _orderItems.forEach(item => {
          // Update only none item status to placed!!!
          if (currentStatus(item.statusLog) === OrderStatus.none) {
            item.statusLog.push({
              status: OrderStatus.placed,
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
                status: OrderStatus.placed,
                ts: deps.timestamp(),
                userId: adminUserId,
              },
            ],
            currentStatus: OrderStatus.placed,
          },
        });
      }),
    );
