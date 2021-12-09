import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { archiveOrder } from '@bgap/shared/utils';
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

describe('archiveOrder test', () => {
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

  it('should archive order', done => {
    const orderId = active_order.id;

    archiveOrder(orderDeps)(orderId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect(order.id).toEqual(orderId);
            expect(order.archived).toBeTruthy();
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
