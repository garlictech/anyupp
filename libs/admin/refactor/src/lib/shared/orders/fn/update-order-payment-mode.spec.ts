import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';

import { updateOrderPaymentMode } from './update-order-payment-mode';

describe('updateOrderPaymentMode test', () => {
  const orderDeps = {
    crudSdk: {
      UpdateOrder: jest.fn().mockReturnValue(of({})),
    },
    timestamp: () => 123456789,
  };

  it('should update order payment mode', done => {
    const updateSpy = jest
      .spyOn(orderDeps.crudSdk, 'UpdateOrder')
      .mockImplementation(jest.fn().mockReturnValue(of({})));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderPaymentMode(<any>orderDeps)('test_order_1_id', {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
      caption: 'cash',
    })
      .pipe(
        tap({
          next() {
            const updateObject = updateSpy.mock.calls[0][0].input;
            expect(updateObject).toMatchSnapshot();
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 3000);
});
