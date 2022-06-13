import { cloneDeep } from 'lodash/fp';
import { iif, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { currentStatus } from '@bgap/crud-gql/api';
import { Order, OrderStatus, PaymentStatus } from '@bgap/domain';
import { OrderHandlerDeps } from '@bgap/shared/types';
import { throwIfEmptyValue } from '@bgap/shared/utils';

export const recallOrderFromHistory =
  (deps: OrderHandlerDeps) => (orderId: string, adminUserId: string) =>
    deps.crudSdk
      .GetOrder({
        id: orderId,
      })
      .pipe(
        throwIfEmptyValue<Order>(),
        switchMap(order => {
          const _orderItems = cloneDeep(order.items);
          _orderItems.forEach(item => {
            if (currentStatus(item.statusLog) === OrderStatus.none) {
              item.statusLog.push({
                status: OrderStatus.ready,
                ts: deps.timestamp(),
                userId: adminUserId,
              });
            }
          });

          return deps.crudSdk
            .UpdateOrder({
              input: {
                id: orderId,
                archived: false,
                items: _orderItems,
                statusLog: [
                  {
                    status: OrderStatus.ready,
                    ts: deps.timestamp(),
                    userId: adminUserId,
                  },
                ],
                currentStatus: OrderStatus.ready,
                transactionStatus: PaymentStatus.waiting_for_payment,
              },
            })
            .pipe(
              switchMap(() =>
                iif(
                  () => !!order.transactionId,
                  deps.crudSdk.UpdateTransaction({
                    input: {
                      id: order.transactionId || '',
                      status: PaymentStatus.waiting_for_payment,
                    },
                  }),
                  of(orderId),
                ),
              ),
            );
        }),
      );
