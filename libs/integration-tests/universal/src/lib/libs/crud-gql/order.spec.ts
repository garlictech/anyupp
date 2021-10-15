import { getDayIntervals, timezoneBudapest } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  orderFixture as ofx,
  transactionFixture as tfx,
  unitFixture,
} from '@bgap/shared/fixtures';
import { IDateIntervals } from '@bgap/shared/types';
import { of } from 'rxjs';
import { delay, map, switchMap, tap } from 'rxjs/operators';

const TEST_NAME = 'ORDER_';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

describe('SearchOrders function', () => {
  let crudSdk: CrudApi.CrudSdk;
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

  beforeAll(async () => {
    crudSdk = CrudApi.getCrudSdkForIAM(accessKeyId, secretAccessKey);

    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
  });

  test('Pagination should return with new archived orders', done => {
    const isoDate = new Date().toISOString();
    const dayIntervals: IDateIntervals = getDayIntervals(
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
    getAllPaginatedData(crudSdk.SearchOrders, searchParams)
      .pipe(
        map(orderList => {
          ordersCount = orderList.items.length;
          expect(orderList.items.length).toBeGreaterThanOrEqual(0);
        }),
        switchMap(() =>
          crudSdk.CreateTransaction({
            input: {
              ...tfx.successCardTransactionInput,
              id: transactionId,
              orderId,
            },
          }),
        ),
        switchMap(() =>
          crudSdk.CreateOrder({
            input: {
              ...ofx.historySuccessCardOrderInput,
              id: orderId,
              transactionId,
            },
          }),
        ),
        delay(5000),
        switchMap(() =>
          getAllPaginatedData(crudSdk.SearchOrders, searchParams).pipe(
            map(orderList => {
              expect(orderList.items.length).toBe(ordersCount + 1);
            }),
          ),
        ),
      )
      .subscribe({
        next: done,
      });
  }, 20000);
});
