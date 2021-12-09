import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { updateOrderPaymentMode } from '@bgap/shared/utils';
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

const waiting_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingStripeOrderInput,
  id: `${testIdPrefix}order_1_id`,
};

describe('updateOrderPaymentMode test', () => {
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
    timestamp: () => 123456789,
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestOrder(waiting_order.id, orderDeps.crudSdk),
    ]);

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authenticatedUserId = x.userAttributes.id;
          waiting_order.userId = authenticatedUserId;
        }),
      )
      .subscribe(() => done());
  }, 25000);

  beforeEach(done => {
    cleanup()
      .pipe(
        delay(DYNAMODB_OPERATION_DELAY),
        switchMap(() => createTestOrder(waiting_order, orderDeps.crudSdk)),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should update order payment mode', done => {
    const orderId = waiting_order.id;
    const paymentMode = {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
      caption: 'cash',
    };

    updateOrderPaymentMode(orderDeps)(orderId, paymentMode)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, orderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(orderId);
            expect((<CrudApi.Order>order)?.paymentMode?.type).toEqual(
              CrudApi.PaymentType.cash,
            );
            expect((<CrudApi.Order>order)?.paymentMode?.method).toEqual(
              CrudApi.PaymentMethod.cash,
            );
            expect((<CrudApi.Order>order)?.paymentMode?.caption).toEqual(
              'cash',
            );
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
