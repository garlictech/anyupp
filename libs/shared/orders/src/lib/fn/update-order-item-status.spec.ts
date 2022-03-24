import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';

import { updateOrderItemStatus } from './update-order-item-status';

describe('updateOrderItemStatus test', () => {
  const waiting_order = {
    userId: 'test-monad',
    items: [
      {
        statusLog: [
          { userId: 'test-alice', status: 'none', ts: 1627909024677 },
        ],
      },
    ],
    statusLog: [{ userId: 'test-alice', status: 'none', ts: 1627909024677 }],
    id: 'test_order_1_id',
  };

  const orderDeps = {
    crudSdk: {
      GetOrder: jest.fn().mockReturnValue(of(waiting_order)),
      UpdateOrder: jest.fn().mockReturnValue(of(waiting_order)),
    },
    timestamp: () => 123456789,
  };

  it('should update order item status', done => {
    const updateSpy = jest
      .spyOn(orderDeps.crudSdk, 'UpdateOrder')
      .mockImplementation(jest.fn().mockReturnValue(of(waiting_order)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderItemStatus(<any>orderDeps)(
      waiting_order.id,
      0,
      CrudApi.OrderStatus.processing,
      waiting_order.userId,
    )
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
