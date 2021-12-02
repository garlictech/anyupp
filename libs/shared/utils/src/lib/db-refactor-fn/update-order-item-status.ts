import { cloneDeep } from 'lodash/fp';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { OrderResolverDeps } from '@bgap/shared/types';
import { throwIfEmptyValue } from '../fn';

export const updateOrderItemStatus =
  (deps: OrderResolverDeps) =>
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
        }

        return deps.crudSdk.UpdateOrder({
          input,
        });
      }),
    );
