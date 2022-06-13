import { OrderStatus } from '@bgap/domain';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  stuckOrderCleanupHandler,
  STUCK_ORDER_TIME_THRESHOLD,
} from './stuck-order-cleanup';

const NOW = 1000000;

const testCases = [
  {
    label: 'No stuck orders',
    result: of({
      items: [],
    }),
  },
  {
    label: 'Stuck order, no timeout',
    result: of({
      items: [
        {
          id: 'ORDER_ID',
          currentStatus: OrderStatus.none,
          updatedAt: `${NOW - STUCK_ORDER_TIME_THRESHOLD + 1}`,
          statusLog: ['OLD STATUSLOG'],
        },
      ],
    }),
  },
  {
    label: 'Stuck order, with timeout',
    result: of({
      items: [
        {
          id: 'ORDER_ID',
          currentStatus: OrderStatus.none,
          updatedAt: `${NOW - STUCK_ORDER_TIME_THRESHOLD - 1}`,
          statusLog: ['OLD STATUSLOG'],
        },
      ],
    }),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
test.each(testCases)('$label', ({ result }, done: any) => {
  const deps = {
    sdk: {
      SearchOrders: jest.fn().mockReturnValue(result),
      UpdateOrder: jest.fn().mockReturnValue(of({})),
    },
    now: () => NOW,
    timeStamp: (dateString: string) => parseInt(dateString),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;

  stuckOrderCleanupHandler(deps)
    .pipe(
      tap(() => {
        expect(deps.sdk.SearchOrders.mock.calls).toMatchSnapshot(
          'SearchOrders',
        );
        expect(deps.sdk.UpdateOrder.mock.calls).toMatchSnapshot('UpdateOrders');
      }),
    )
    .subscribe(() => done());
});
