import { OrderResolverDeps } from '@bgap/shared/types';

export const archiveOrder = (deps: OrderResolverDeps) => (orderId: string) =>
  deps.crudSdk.UpdateOrder({
    input: {
      id: orderId,
      archived: true,
    },
  });
