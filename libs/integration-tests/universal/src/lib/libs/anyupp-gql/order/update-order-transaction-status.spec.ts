import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { updateOrderTransactionStatus } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixture,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  transactionFixture,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';

import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { createTestOrder, deleteTestOrder } from '../../../seeds/order';
import {
  createTestTransaction,
  deleteTestTransaction,
} from '../../../seeds/transaction';
import { getOrder } from './test-helper';

const DYNAMODB_OPERATION_DELAY = 5000;

const orderId = `${testIdPrefix}order_1_id`;
const transactionId = `${testIdPrefix}transaction_1_id`;

const transaction: RequiredId<CrudApi.CreateTransactionInput> = {
  ...transactionFixture.cardTransaction,
  id: transactionId,
  orderId,
  userId: `test-alice`,
};

const active_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCardOrderInput,
  id: orderId,
  transactionId,
};

describe('updateOrderTransactionStatus test', () => {
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
    timestamp: () => 123456789,
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestOrder(active_order.id, orderDeps.crudSdk),
      deleteTestTransaction(transaction.id, orderDeps.crudSdk),
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
        switchMap(() =>
          combineLatest([
            createTestOrder(active_order, orderDeps.crudSdk),
            createTestTransaction(transaction, orderDeps.crudSdk),
          ]),
        ),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should update order success transaction status', done => {
    const status = CrudApi.PaymentStatus.success;

    updateOrderTransactionStatus(orderDeps)(orderId, transactionId, status)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect((<CrudApi.Order>order).transactionStatus).toEqual(status);
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);

  it('should update order failed transaction status', done => {
    const status = CrudApi.PaymentStatus.failed;

    updateOrderTransactionStatus(orderDeps)(
      orderId,
      transactionId,
      status,
      CrudApi.UnpayCategory.manager_meal,
    )
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect((<CrudApi.Order>order).transactionStatus).toEqual(status);
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
