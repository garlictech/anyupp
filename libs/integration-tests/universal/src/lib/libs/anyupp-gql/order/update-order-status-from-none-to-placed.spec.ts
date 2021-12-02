import { combineLatest } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

import { updateOrderStatusFromNoneToPlaced } from '@bgap/shared/utils';
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

const new_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCardOrderInput,
  id: `${testIdPrefix}order_1_id`,
};

const inprogress_order: RequiredId<CrudApi.CreateOrderInput> = {
  ...orderFixture.activeWaitingCashOrderInput,
  id: `${testIdPrefix}order_2_id`,
  items: [
    {
      ...orderFixture.activeWaitingCashOrderInput.items[0],
      statusLog: [
        {
          ...orderFixture.activeWaitingCashOrderInput.items[0].statusLog[0],
        },
        orderFixture.getOrderStatusLogItem(CrudApi.OrderStatus.placed),
        orderFixture.getOrderStatusLogItem(CrudApi.OrderStatus.processing),
      ],
    },
    orderFixture.activeWaitingCashOrderInput.items[1],
  ],
};

describe('updateOrderStatusFromNoneToPlaced test', () => {
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
    timestamp: () => 123456789,
  };

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestOrder(new_order.id, orderDeps.crudSdk),
      deleteTestOrder(inprogress_order.id, orderDeps.crudSdk),
    ]);

  beforeAll(done => {
    createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .pipe(
        tap(x => {
          authenticatedUserId = x.userAttributes.id;
          new_order.userId = authenticatedUserId;
          inprogress_order.userId = authenticatedUserId;
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
            createTestOrder(new_order, orderDeps.crudSdk),
            createTestOrder(inprogress_order, orderDeps.crudSdk),
          ]),
        ),
      )
      .subscribe(() => done());
  }, 25000);

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should update new order status from none to placed', done => {
    const newOrderId = new_order.id;
    const userId = new_order.userId;

    updateOrderStatusFromNoneToPlaced(orderDeps)(newOrderId, userId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, newOrderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(newOrderId);
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).statusLog),
            ).toEqual(CrudApi.OrderStatus.placed);
            (<CrudApi.Order>order).items.forEach(item => {
              expect(CrudApi.currentStatus(item.statusLog)).toEqual(
                CrudApi.OrderStatus.placed,
              );
            });
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);

  it('should update inprogress order status from none to placed', done => {
    const inprogressOrderId = inprogress_order.id;
    const userId = new_order.userId;

    updateOrderStatusFromNoneToPlaced(orderDeps)(inprogressOrderId, userId)
      .pipe(
        filterNullish(),
        delay(1000),
        switchMap(() => getOrder(orderDeps.crudSdk, inprogressOrderId)),
        tap({
          next(order) {
            expect(order).not.toBeNull();
            expect((<CrudApi.Order>order).id).toEqual(inprogressOrderId);
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).statusLog),
            ).toEqual(CrudApi.OrderStatus.placed);

            // Should not updated from processing to placed
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).items[0].statusLog),
            ).toEqual(CrudApi.OrderStatus.processing);

            // Should updated from none to placed
            expect(
              CrudApi.currentStatus((<CrudApi.Order>order).items[1].statusLog),
            ).toEqual(CrudApi.OrderStatus.placed);
          },
        }),
      )
      .subscribe(() => {
        done();
      });
  }, 30000);
});
