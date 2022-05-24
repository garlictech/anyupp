import { cloneDeep } from 'lodash/fp';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '@bgap/shared/utils';

import { OrderHandlerDeps } from '@bgap/shared/types';

export const updateOrderItemStatus =
  (deps: OrderHandlerDeps) =>
  (
    orderId: string,
    itemIdx: number,
    status: CrudApi.OrderStatus,
    adminUserId: string,
  ) =>
    from(
      deps.crudSdk.GetOrder({
        id: orderId,
      }),
    ).pipe(
      throwIfEmptyValue<CrudApi.Order>(),
      switchMap(order => {
        const _orderItems = cloneDeep(order.items);
        _orderItems[itemIdx].statusLog.push({
          status,
          ts: deps.timestamp(),
          userId: adminUserId,
        });

        const input: CrudApi.UpdateOrderInput = {
          id: orderId,
          items: _orderItems,
        };

        const newOrderStatus = CrudApi.getOrderStatusByItemsStatus(_orderItems);

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
