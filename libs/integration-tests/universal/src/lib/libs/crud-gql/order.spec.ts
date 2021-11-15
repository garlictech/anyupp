import { getDayIntervals } from '@bgap/admin/shared/utils';
import { timezoneBudapest } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  orderFixture as ofx,
  transactionFixture as tfx,
  unitFixture,
} from '@bgap/shared/fixtures';

import { DateIntervals } from '@bgap/shared/types';
import { of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';

const TEST_NAME = 'ORDER_';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

describe('SearchOrders function', () => {
  let crudSdk: CrudApi.CrudSdk = CrudApi.getCrudSdkForIAM(
    accessKeyId,
    secretAccessKey,
  );
  let anyuppSdk: AnyuppApi.AnyuppSdk = AnyuppApi.getAnyuppSdkForIAM(
    accessKeyId,
    secretAccessKey,
  );

  const orderId = 'int_test_order_id_1';
  const transactionId = 'int_test_transaction_id_1';

  const cleanup = async () => {
    await crudSdk
      .DeleteOrder({
        input: {
          id: orderId,
        },
      })
      .toPromise();

    await crudSdk
      .DeleteTransaction({
        input: {
          id: transactionId,
        },
      })
      .toPromise();
  };

  beforeEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  const testLogic = (
    searchOp: (
      input: CrudApi.QuerySearchOrdersArgs,
    ) => ReturnType<CrudApi.CrudSdk['SearchOrders']>,

    createTransactionOp: (
      input: CrudApi.MutationCreateTransactionArgs,
    ) => ReturnType<CrudApi.CrudSdk['CreateTransaction']>,

    createOrderOp: (
      input: CrudApi.MutationCreateOrderArgs,
    ) => ReturnType<CrudApi.CrudSdk['CreateOrder']>,
  ) => {
    const isoDate = new Date().toISOString();
    const dayIntervals: DateIntervals = getDayIntervals(
      isoDate,
      timezoneBudapest,
    );
    const searchParams = {
      query: {
        filter: {
          unitId: { eq: unitFixture.unitId_seeded_01 },
          archived: { eq: true },
          createdAt: {
            gte: new Date(dayIntervals.from).toISOString(),
            lte: new Date(dayIntervals.to).toISOString(),
          },
        },
      },
      options: { fetchPolicy: 'no-cache' },
    };
    let ordersCount = -1;

    // Get initial list
    return getAllPaginatedData(searchOp, searchParams).pipe(
      map(orderList => {
        ordersCount = orderList.items.length;
        expect(orderList.items.length).toBeGreaterThanOrEqual(0);
      }),
      switchMap(() =>
        createTransactionOp({
          input: {
            ...tfx.successCardTransactionInput,
            id: transactionId,
            orderId,
          },
        }),
      ),
      switchMap(() =>
        createOrderOp({
          input: {
            ...ofx.historySuccessCardOrderInput,
            id: orderId,
            transactionId,
          },
        }),
      ),
      delay(5000),
      switchMap(() =>
        getAllPaginatedData(searchOp, searchParams).pipe(
          map(orderList => {
            expect(orderList.items.length).toBe(ordersCount + 1);
          }),
        ),
      ),
    );
  };

  test('Pagination should return with new archived orders - with API', done => {
    testLogic(
      crudSdk.SearchOrders,
      crudSdk.CreateTransaction,
      crudSdk.CreateOrder,
    ).subscribe({
      next: done,
    });
  }, 20000);
});
