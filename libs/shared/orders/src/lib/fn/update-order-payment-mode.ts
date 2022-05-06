import { from } from 'rxjs';

import * as CrudApi from '@bgap/crud-gql/api';

import { OrderHandlerDeps } from '@bgap/shared/types';

export const updateOrderPaymentMode =
  (deps: OrderHandlerDeps) =>
  (orderId: string, paymentMode: CrudApi.PaymentMode) =>
    from(
      deps.crudSdk.UpdateOrder({
        input: {
          id: orderId,
          paymentMode,
        },
      }),
    );
