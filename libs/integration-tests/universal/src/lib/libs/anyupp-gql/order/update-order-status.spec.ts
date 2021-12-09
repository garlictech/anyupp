import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { updateOrderStatus } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';

import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestOrder, deleteTestOrder } from '../../../seeds/order';
import { getOrder } from './test-helper';

const DYNAMODB_OPERATION_DELAY = 5000;

const active_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCardOrderInput,
  id: `${testIdPrefix}order_1_id`,
};

describe('updateOrderStatus test', () => {
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
    timestamp: () => 123456789,
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestOrder(active_order.id, orderDeps.crudSdk),
    ]);

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authenticatedUserId = x.userAttributes.id;
          active_order.userId = authenticatedUserId;
        }),
      )
      .subscribe(() => done());
  }, 25000);

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() => createTestOrder(active_order, orderDeps.crudSdk)),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should update order status', done => {
    const orderId = active_order.id;
    const userId = active_order.userId;
    const status = CrudApi.OrderStatus.ready;

    updateOrderStatus(orderDeps)(orderId, status, userId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).statusLog),
            ).toEqual(CrudApi.OrderStatus.ready);
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
