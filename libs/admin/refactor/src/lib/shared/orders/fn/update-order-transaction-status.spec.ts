import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';

import { updateOrderTransactionStatus } from './update-order-transaction-status';

const orderId = `test_order_1_id`;
const transactionId = `test_transaction_1_id`;

describe('updateOrderTransactionStatus test', () => {
  const orderDeps = {
    crudSdk: {
      UpdateOrder: jest.fn().mockReturnValue(of({})),
      UpdateTransaction: jest.fn().mockReturnValue(of({})),
    },
    timestamp: () => 123456789,
  };

  const updateOrderSpy = jest
    .spyOn(orderDeps.crudSdk, 'UpdateOrder')
    .mockImplementation(jest.fn().mockReturnValue(of({ id: orderId })));

  const updateTransactionSpy = jest
    .spyOn(orderDeps.crudSdk, 'UpdateTransaction')
    .mockImplementation(
      jest.fn().mockReturnValue(
        of({
          id: transactionId,
          orderId,
          userId: `test-alice`,
        }),
      ),
    );

  it('should update order success transaction status', done => {
    const status = CrudApi.PaymentStatus.success;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderTransactionStatus(<any>orderDeps)(orderId, transactionId, status)
      .pipe(
        tap({
          next() {
            const updateOrderObject = updateOrderSpy.mock.calls[0][0].input;
            const updateTransactionObject =
              updateTransactionSpy.mock.calls[0][0].input;

            expect(updateOrderObject).toMatchSnapshot();
            expect(updateTransactionObject).toMatchSnapshot();
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 3000);

  it('should update order failed transaction status', done => {
    const status = CrudApi.PaymentStatus.failed;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderTransactionStatus(<any>orderDeps)(
      orderId,
      transactionId,
      status,
      CrudApi.UnpayCategory.manager_meal,
    )
      .pipe(
        tap({
          next() {
            const updateOrderObject = updateOrderSpy.mock.calls[0][0].input;
            const updateTransactionObject =
              updateTransactionSpy.mock.calls[0][0].input;

            expect(updateOrderObject).toMatchSnapshot();
            expect(updateTransactionObject).toMatchSnapshot();
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 3000);
});
