import { cloneDeep } from 'lodash/fp';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { throwIfEmptyValue } from '@bgap/shared/utils';

import { OrderHandlerDeps } from './utils';
import { Order, OrderStatus, UpdateOrderInput } from '@bgap/domain';
import { getOrderStatusByItemsStatus } from '@bgap/crud-gql/api';

export const updateOrderItemStatus =
  (deps: OrderHandlerDeps) =>
  (
    orderId: string,
    itemIdx: number,
    status: OrderStatus,
    adminUserId: string,
  ) =>
    from(
      deps.crudSdk.GetOrder({
        id: orderId,
      }),
    ).pipe(
      throwIfEmptyValue<Order>(),
      switchMap(order => {
        const _orderItems = cloneDeep(order.items);
        _orderItems[itemIdx].statusLog.push({
          status,
          ts: deps.timestamp(),
          userId: adminUserId,
        });

        const input: UpdateOrderInput = {
          id: orderId,
          items: _orderItems,
        };

        const newOrderStatus = getOrderStatusByItemsStatus(_orderItems);

        if (newOrderStatus) {
          input.statusLog = [
            {
              status: newOrderStatus,
              ts: deps.timestamp(),
              userId: adminUserId,
            },
          ];
          input.currentStatus = newOrderStatus;
        }

        return deps.crudSdk.UpdateOrder({
          input,
        });
      }),
    );
