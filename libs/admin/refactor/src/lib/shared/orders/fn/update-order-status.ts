import { OrderStatus } from '@bgap/domain';
import { OrderHandlerDeps } from './utils';

export const updateOrderStatus =
  (deps: OrderHandlerDeps) =>
  (orderId: string, status: OrderStatus, adminUserId: string) =>
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
