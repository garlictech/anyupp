import * as CrudApi from '@bgap/crud-gql/api';

import { OrderHandlerDeps } from '@bgap/shared/types';

export const updateOrderStatus =
  (deps: OrderHandlerDeps) =>
  (orderId: string, status: CrudApi.OrderStatus, adminUserId: string) =>
    deps.crudSdk.UpdateOrder({
      input: {
        id: orderId,
        statusLog: [
          {
            status,
            ts: deps.timestamp(),
            userId: adminUserId,
          },
        ],
        currentStatus: status,
      },
    });
