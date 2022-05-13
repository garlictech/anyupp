import { pipe, flow } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { combineLatest, of } from 'rxjs';
import * as CrudSdk from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { map, switchMap, tap, delay, shareReplay } from 'rxjs/operators';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const DYNAMODB_OPERATION_DELAY = 1000;

describe('Test paginated graphql lists', () => {
  const crudSdk = CrudSdk.getCrudSdkForIAM(accessKeyId, secretAccessKey);
  const testId = 'pagination-test-guy';

  const objectIds = pipe(
    R.range(1, 5),
    R.map(counter => testId + counter),
  );

  const cleanup = () =>
    pipe(
      objectIds,
      R.map(id =>
        crudSdk.DeleteAdminUser({
          input: { id },
        }),
      ),
      combineLatest,
    );

  const setup = cleanup().pipe(
    delay(DYNAMODB_OPERATION_DELAY),
    switchMap(() =>
      pipe(
        R.range(1, 5),
        R.map(counter =>
          crudSdk.CreateAdminUser({
            input: {
              id: testId + counter,
              name: testId,
              email: `testuser+${testId}${counter}@anyupp.com`,
              phone: `+6923456789${counter}`,
            },
          }),
        ),
        combineLatest,
      ),
    ),
    tap(() => console.log('SETUP EXECUTED')),
    shareReplay(1),
  );

  beforeEach(async () => {
    await setup.toPromise();
  }, 60000);

  afterAll(async () => {
    await cleanup().toPromise();
  }, 60000);

  const limitCases = [undefined, null, 1, 2, 3, 4, 5, 100000];

  test.each(limitCases)(
    'Pagination must work with limit %p',
    async limit => {
      await getAllPaginatedData(crudSdk.ListAdminUsers, {
        query: {
          limit,
          filter: { name: { eq: testId } },
        },
      })
        .pipe(
          map(
            flow(
              result => result.items,
              R.map(data => data?.id),
              ids => ids.sort(),
              ids => {
                expect(ids.length).toEqual(4);
                expect(R.any(R.isNil)(ids)).toEqual(false);
                expect(ids).toEqual(objectIds);
              },
            ),
          ),
        )
        .toPromise();
    },
    100000,
  );

  test('Pagination must work with missing limit', async () => {
    await getAllPaginatedData(crudSdk.ListAdminUsers, {
      query: {
        filter: { name: { eq: testId } },
      },
    })
      .pipe(
        map(
          flow(
            result => result.items,
            R.map(data => data?.id),
            ids => ids.sort(),
            ids => {
              expect(ids.length).toEqual(4);
              expect(R.any(R.isNil)(ids)).toEqual(false);
              expect(ids).toEqual(objectIds);
            },
          ),
        ),
      )
      .toPromise();
  }, 60000);

  test('Pagination must work with missing op parameter', async () => {
    await getAllPaginatedData(crudSdk.ListAdminUsers)
      .pipe(
        map(
          flow(
            result => result.items,
            ids => {
              expect(ids.length).toBeGreaterThanOrEqual(4);
            },
          ),
        ),
      )
      .toPromise();
  }, 60000);

  test('Pagination should call operation with proper options', () => {
    const operation = jest.fn().mockReturnValue(of({}));

    getAllPaginatedData(operation, {
      query: { limit: 100 },
      options: { fetchPolicy: 'no-cache' },
    });

    expect((operation as jest.Mock).mock.calls).toMatchSnapshot();
  }, 60000);
});
