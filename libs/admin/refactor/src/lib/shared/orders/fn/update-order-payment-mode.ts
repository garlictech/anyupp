import { from } from 'rxjs';

import { OrderHandlerDeps } from '@bgap/shared/types';
import { PaymentMode } from '@bgap/domain';

export const updateOrderPaymentMode =
  (deps: OrderHandlerDeps) => (orderId: string, paymentMode: PaymentMode) =>
    from(
      deps.crudSdk.UpdateOrder({
        input: {
          id: orderId,
          paymentMode,
        },
      }),
    );
