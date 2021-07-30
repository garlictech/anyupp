import { pipe, flow } from 'fp-ts/lib/function';
import * as R from 'ramda';
import { from, of, throwError } from 'rxjs';
import * as CrudSdk from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { map, mergeMap, switchMap, toArray, tap } from 'rxjs/operators';
import { v1 as uuid } from 'uuid';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

describe('Test paginated graphql lists', () => {
  const crudSdk = CrudSdk.getCrudSdkForIAM(accessKeyId, secretAccessKey);
  const testId = uuid();
  let objectIds: string[];

  beforeAll(async () => {
    objectIds = await pipe(
      R.range(1, 5),
      R.map(
        (): CrudSdk.CreateAdminUserInput => ({
          name: testId,
          email: 'a@a.hu',
          phone: '00123456789',
        }),
      ),
      x => from(x),
    )
      .pipe(
        mergeMap(input => crudSdk.CreateAdminUser({ input })),
        map(output => output?.id),
        switchMap(id =>
          id ? of(id) : throwError('Test object cannot be created'),
        ),
        toArray(),
        map(ids => ids.sort()),
        tap(objects =>
          console.debug(`Created ${objects?.length} test objects.`),
        ),
      )
      .toPromise();
  });

  afterAll(async () => {
    await from(objectIds)
      .pipe(
        mergeMap(id => crudSdk.DeleteAdminUser({ input: { id } })),
        toArray(),
        tap(objects =>
          console.debug(`Deleted ${objects?.length} test objects.`),
        ),
      )
      .toPromise();
  });

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
  });

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
  });

  test('Pagination should call operation with proper options', () => {
    const operation = jest.fn().mockReturnValue(of({}));

    getAllPaginatedData(operation, {
      query: { limit: 100 },
      options: { fetchPolicy: 'no-cache' },
    });

    expect((operation as jest.Mock).mock.calls).toMatchSnapshot();
  });
});
