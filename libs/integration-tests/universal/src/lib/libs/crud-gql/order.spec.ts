import { getDayIntervals, timezoneBudapest } from '@bgap/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  cardPayment,
  orderFixtureBase as ofx,
  transactionFixture as tfx,
  unitFixture,
} from '@bgap/shared/fixtures';

import { DateIntervals } from '@bgap/shared/types';
import { delay, map, switchMap } from 'rxjs/operators';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

describe.skip('SearchOrders function', () => {
  let crudSdk: CrudApi.CrudSdk = CrudApi.getCrudSdkForIAM(
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
  }, 60000);

  afterAll(async () => {
    await cleanup();
  }, 60000);

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
            ...ofx.historyOrderInputBase,
            ...cardPayment,
            id: orderId,
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
  }, 60000);
});
