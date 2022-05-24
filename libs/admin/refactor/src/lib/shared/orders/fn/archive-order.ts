import { OrderHandlerDeps } from '@bgap/shared/types';

export const archiveOrder = (deps: OrderHandlerDeps) => (orderId: string) =>
  deps.crudSdk.UpdateOrder({
    input: {
      id: orderId,
      archived: true,
    },
  });
