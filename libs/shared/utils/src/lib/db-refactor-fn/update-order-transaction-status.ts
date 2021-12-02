import { switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { OrderResolverDeps } from '@bgap/shared/types';

export const updateOrderTransactionStatus =
  (deps: OrderResolverDeps) =>
  (
    orderId: string,
    transactionId: string,
    status: CrudApi.PaymentStatus,
    unpayCategory?: CrudApi.UnpayCategory,
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
