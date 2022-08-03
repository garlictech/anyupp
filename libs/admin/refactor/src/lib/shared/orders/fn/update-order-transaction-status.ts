import { switchMap } from 'rxjs/operators';

import { PaymentStatus, UnpayCategory } from '@bgap/domain';
import { OrderHandlerDeps } from './utils';

export const updateOrderTransactionStatus =
  (deps: OrderHandlerDeps) =>
  (
    orderId: string,
    transactionId: string,
    status: PaymentStatus,
    unpayCategory?: UnpayCategory,
  ) =>
    deps.crudSdk
      .UpdateTransaction({
        input: {
          id: transactionId,
          status,
        },
      })
      .pipe(
        switchMap(() =>
          deps.crudSdk.UpdateOrder({
            input: {
              id: orderId,
              transactionStatus: status,
              unpayCategory,
            },
          }),
        ),
      );
