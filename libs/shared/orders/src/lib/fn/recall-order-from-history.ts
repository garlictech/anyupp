import { cloneDeep } from 'lodash/fp';
import { iif, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { throwIfEmptyValue } from '@bgap/shared/utils';
import { OrderHandlerDeps } from '@bgap/shared/types';

export const recallOrderFromHistory =
  (deps: OrderHandlerDeps) => (orderId: string, adminUserId: string) =>
    deps.crudSdk
      .GetOrder({
        id: orderId,
      })
      .pipe(
        throwIfEmptyValue<CrudApi.Order>(),
        switchMap(order => {
          const _orderItems = cloneDeep(order.items);
          _orderItems.forEach(item => {
            if (
              CrudApi.currentStatus(item.statusLog) === CrudApi.OrderStatus.none
            ) {
              item.statusLog.push({
                status: CrudApi.OrderStatus.ready,
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
                    status: CrudApi.OrderStatus.ready,
                    ts: deps.timestamp(),
                    userId: adminUserId,
                  },
                ],
                currentStatus: CrudApi.OrderStatus.ready,
                transactionStatus: CrudApi.PaymentStatus.waiting_for_payment,
              },
            })
            .pipe(
              switchMap(() =>
                iif(
                  () => !!order.transactionId,
                  deps.crudSdk.UpdateTransaction({
                    input: {
                      id: order.transactionId || '',
                      status: CrudApi.PaymentStatus.waiting_for_payment,
                    },
                  }),
                  of(orderId),
                ),
              ),
            );
        }),
      );
