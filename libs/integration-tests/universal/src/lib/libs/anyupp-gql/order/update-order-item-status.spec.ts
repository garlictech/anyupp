import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { updateOrderItemStatus } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  orderFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';

import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestOrder, deleteTestOrder } from '../../../seeds/order';
import { getOrder } from './test-helper';

const DYNAMODB_OPERATION_DELAY = 5000;

const active_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCardOrderInput,
  id: `${testIdPrefix}order_1_id`,
};

describe.skip('updateOrderItemStatus test', () => {
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
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(() => {
          active_order.userId = getCognitoUsername(testAdminUsername);
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

  it('should update order item status', done => {
    const orderId = active_order.id;
    const itemIdx = 0;
    const userId = active_order.userId;
    const status = CrudApi.OrderStatus.processing;

    updateOrderItemStatus(orderDeps)(orderId, itemIdx, status, userId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).items[0]?.statusLog),
            ).toEqual(CrudApi.OrderStatus.processing);
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
