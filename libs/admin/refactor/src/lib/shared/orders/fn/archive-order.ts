import { OrderHandlerDeps } from './utils';

export const archiveOrder = (deps: OrderHandlerDeps) => (orderId: string) =>
  deps.crudSdk.UpdateOrder({
    input: {
      id: orderId,
      archived: true,
    },
  });
