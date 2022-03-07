import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { recallOrderFromHistory } from '@bgap/shared/utils';
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

const archived_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCardOrderInput,
  id: `${testIdPrefix}order_1_id`,
  archived: true,
};

describe('recallOrderFromHistory test', () => {
  const orderDeps = {
    crudSdk: createIamCrudSdk(),
    timestamp: () => 123456789,
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestOrder(archived_order.id, orderDeps.crudSdk),
    ]);

  beforeAll(done => {
    createAuthenticatedCrudSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(() => {
          archived_order.userId = getCognitoUsername(testAdminUsername);
        }),
      )
      .subscribe(() => done());
  }, 25000);

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() => createTestOrder(archived_order, orderDeps.crudSdk)),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should recall order from history', done => {
    const orderId = archived_order.id;
    const userId = archived_order.userId;

    recallOrderFromHistory(orderDeps)(orderId, userId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect((<CrudApi.Order>order).archived).toBeFalsy();
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
