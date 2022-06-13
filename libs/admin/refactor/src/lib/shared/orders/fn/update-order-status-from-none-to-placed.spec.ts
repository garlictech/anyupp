import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OrderStatus } from '@bgap/domain';

import { updateOrderStatusFromNoneToPlaced } from './update-order-status-from-none-to-placed';

const new_order = {
  id: `test_order_1_id`,
  userId: 'test-alice',
  items: [
    {
      statusLog: [
        {
          userId: 'test-alice',
          status: OrderStatus.none,
          ts: 1627909024677,
        },
      ],
    },
    {
      statusLog: [
        {
          userId: 'test-alice',
          status: OrderStatus.none,
          ts: 1627909024677,
        },
      ],
    },
  ],
};

const inprogress_order = {
  id: `test_order_1_id`,
  userId: 'test-alice',
  items: [
    {
      statusLog: [
        {
          userId: 'test-alice',
          status: OrderStatus.none,
          ts: 1627909024677,
        },
        {
          userId: 'test-alice',
          status: OrderStatus.placed,
          ts: 1627909024678,
        },
        {
          userId: 'test-alice',
          status: OrderStatus.processing,
          ts: 1627909024679,
        },
      ],
    },
    {
      statusLog: [
        {
          userId: 'test-alice',
          status: OrderStatus.none,
          ts: 1627909024677,
        },
      ],
    },
  ],
};

describe('updateOrderStatusFromNoneToPlaced test', () => {
  it('should update new order status from none to placed', done => {
    const orderDeps = {
      crudSdk: {
        GetOrder: jest.fn().mockReturnValue(of(new_order)),
        UpdateOrder: jest.fn().mockReturnValue(of(new_order)),
      },
      timestamp: () => 123456789,
    };

    const updateSpy = jest
      .spyOn(orderDeps.crudSdk, 'UpdateOrder')
      .mockImplementation(jest.fn().mockReturnValue(of(new_order)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderStatusFromNoneToPlaced(<any>orderDeps)(
      new_order.id,
      new_order.userId,
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

  it('should update inprogress order status from none to placed', done => {
    const orderDeps = {
      crudSdk: {
        GetOrder: jest.fn().mockReturnValue(of(inprogress_order)),
        UpdateOrder: jest.fn().mockReturnValue(of(inprogress_order)),
      },
      timestamp: () => 123456789,
    };

    const updateSpy = jest
      .spyOn(orderDeps.crudSdk, 'UpdateOrder')
      .mockImplementation(jest.fn().mockReturnValue(of(inprogress_order)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateOrderStatusFromNoneToPlaced(<any>orderDeps)(
      inprogress_order.id,
      inprogress_order.userId,
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
