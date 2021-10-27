import * as fs from 'fs';
import request from 'supertest';
import { config } from '@bgap/shared/config';
import * as CrudApi from '@bgap/crud-gql/api';
import { createIamCrudSdk } from '../../../api-clients';
import {
  mergeMap,
  shareReplay,
  switchMap,
  delay,
  tap,
  switchMapTo,
  takeLast,
  toArray,
  map,
  count,
} from 'rxjs/operators';
import {
  createRkeeperProduct,
  updateRkeeperProduct,
  searchExternalUnitProduct,
  getBusinessEntityInfo,
  handleRkeeperProducts,
  createDefaultProductCategory,
} from '@bgap/rkeeper-api';
import { from, Observable, combineLatest } from 'rxjs';
import { ES_DELAY, DYNAMO_DELAY } from '../../../utils';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import * as fixtures from './fixtures';
import {
  deleteGeneratedProductsForAUnitFromDb,
  listGeneratedProductsForUnits,
} from '@bgap/anyupp-gql/backend';
import { getAllPaginatedData } from '@bgap/gql-sdk';

describe('Test the rkeeper api basic functionality', () => {
  const crudSdk = createIamCrudSdk();

  const dirtyItemDeleter = <Y extends { id: string }>(
    searchOp: (x: { filter: { dirty: { eq: boolean } } }) => Observable<
      | {
          items?: CrudApi.Maybe<Array<CrudApi.Maybe<Y>>>;
        }
      | undefined
      | null
    >,
    deleteOp: (x: { input: { id: string } }) => any,
  ) =>
    getAllPaginatedData(searchOp, {
      query: { filter: { dirty: { eq: true } } },
    }).pipe(
      filterNullishGraphqlListWithDefault<Y>([]),
      tap(items => console.log(`Found ${items.length} items do delete`)),
      switchMap(from),
      mergeMap((item: Y) =>
        deleteOp({
          input: { id: item.id },
        }),
      ),
      toArray(),
    );

  const cleanup$ = combineLatest(
    dirtyItemDeleter(crudSdk.SearchUnitProducts, crudSdk.DeleteUnitProduct),
    dirtyItemDeleter(crudSdk.SearchGroupProducts, crudSdk.DeleteGroupProduct),
    dirtyItemDeleter(crudSdk.SearchChainProducts, crudSdk.DeleteChainProduct),
  ).pipe(
    switchMap(() =>
      from([fixtures.rkeeperUnitProduct, fixtures.rkeeperUnitProduct2]),
    ),
    mergeMap(
      item =>
        crudSdk.DeleteUnitProduct({
          input: { id: item.id },
        }),
      100,
    ),
    count(),
    tap(num => console.log(`${num} deleted products`)),
    switchMap(() =>
      combineLatest(
        crudSdk.DeleteUnit({ input: { id: fixtures.rkeeperUnit.id } }),
        crudSdk.DeleteGroup({ input: { id: fixtures.createGroup.id } }),
        crudSdk.DeleteChain({ input: { id: fixtures.createChain.id } }),
        deleteGeneratedProductsForAUnitFromDb(crudSdk)(''),
      ),
    ),
  );

  beforeEach(done => {
    cleanup$
      .pipe(
        delay(ES_DELAY),
        switchMapTo(
          from([fixtures.rkeeperUnitProduct, fixtures.rkeeperUnitProduct2]),
        ),
        mergeMap(input => crudSdk.CreateUnitProduct({ input })),
        takeLast(1),
        switchMap(() =>
          combineLatest(
            crudSdk.CreateUnit({ input: fixtures.rkeeperUnit }),
            crudSdk.CreateGroup({ input: fixtures.createGroup }),
            crudSdk.CreateChain({ input: fixtures.createChain }),
          ),
        ),
        delay(ES_DELAY),
      )
      .subscribe(() => done());
  }, 65000);

  afterAll(done => {
    cleanup$.subscribe(() => done());
  }, 30000);

  test('It should be able to send a POST to the webhook', done => {
    request(config.RKeeperWebhookEndpoint).post('/').expect(200, done);
  });

  test('It shouls be able to search for external product', done => {
    searchExternalUnitProduct(crudSdk)(fixtures.rkeeperProductGuid)
      .pipe(
        tap(res =>
          expect(res?.id).toMatchSnapshot('existing external product'),
        ),
        switchMap(() =>
          searchExternalUnitProduct(crudSdk)('NOT EXISTING PRODUCT'),
        ),
        tap(res =>
          expect(res).toMatchSnapshot('NOT existing external product'),
        ),
      )
      .subscribe(() => done());
  });

  test('Create products by an rkeeper product', done => {
    const matcher = (expectParentId = true) =>
      pipe(
        {
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          id: expect.any(String),
        },
        item =>
          expectParentId ? { ...item, parentId: expect.any(String) } : item,
      );

    const verifyer = <Y>(
      op: (x: { filter: { dirty: { eq: boolean } } }) => Observable<
        | {
            items?: CrudApi.Maybe<Array<CrudApi.Maybe<Y>>>;
          }
        | undefined
        | null
      >,
      label: string,
      expectParentId = true,
    ) =>
      op({ filter: { dirty: { eq: true } } }).pipe(
        filterNullishGraphqlListWithDefault<Y>([]),
        tap(res =>
          expect(res).toMatchSnapshot([matcher(expectParentId)], label),
        ),
      );

    createRkeeperProduct(crudSdk)(
      fixtures.businessEntity,
      fixtures.processedDish,
    )
      .pipe(
        delay(ES_DELAY),
        switchMap(() =>
          combineLatest(
            verifyer<CrudApi.UnitProduct>(
              crudSdk.SearchUnitProducts,
              'UNITPRODUCTS',
            ),
            verifyer<CrudApi.GroupProduct>(
              crudSdk.SearchGroupProducts,
              'GROUPPRODUCTS',
            ),
            verifyer<CrudApi.ChainProduct>(
              crudSdk.SearchChainProducts,
              'CHAINPRODUCTS',
              false,
            ),
          ),
        ),
        map(([unitProducts]) => unitProducts[0]),
        switchMap(unitProduct =>
          updateRkeeperProduct(crudSdk)(
            { ...fixtures.processedDish, name: 'NEW NAME', price: 1000000 },
            unitProduct,
          ),
        ),
        tap(res =>
          expect(res).toMatchSnapshot(matcher(), 'update rkeeper product'),
        ),
      )
      .subscribe(() => done());
  }, 15000);

  test('getBusinessEntityInfo - not existing restaurant', done => {
    getBusinessEntityInfo(crudSdk)('NOT EXISTING RESTO`').subscribe({
      error: (err: unknown) => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  });

  test('getBusinessEntityInfo - existing restaurant', done => {
    getBusinessEntityInfo(crudSdk)(
      fixtures.rkeeperUnit.externalRestaurantId ?? 'something is wrong',
    ).subscribe({
      next: result => {
        expect(result).toMatchSnapshot();
        done();
      },
    });
  });

  test('Test full rkeeper product handling - not not existing unit', done => {
    handleRkeeperProducts(crudSdk)(
      'NOT EXISTING RESTAURANT',
      fixtures.rawData,
    ).subscribe({
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  test('Test full rkeeper product handling - the use case', done => {
    handleRkeeperProducts(crudSdk)(
      fixtures.rkeeperUnit?.externalRestaurantId ?? 'Something is wrong',
      fixtures.rawData,
    )
      .pipe(
        delay(ES_DELAY),
        switchMap(() =>
          listGeneratedProductsForUnits(crudSdk)([fixtures.rkeeperUnit.id]),
        ),
      )
      .subscribe({
        next: result => {
          result.forEach(res =>
            expect(res).toMatchSnapshot({
              id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
          done();
        },
      });
  }, 25000);

  test.only('Test full rkeeper product handling - the use case with lots of records', done => {
    const rawData = JSON.parse(
      fs.readFileSync(__dirname + '/menu-data.json').toString(),
    );

    handleRkeeperProducts(crudSdk)(
      fixtures.rkeeperUnit?.externalRestaurantId ?? 'Something is wrong',
      rawData,
    ).subscribe({
      next: result => {
        expect(result).toMatchSnapshot();
        done();
      },
    });
  }, 120000);

  test('createDefaultProductCategory', done => {
    getBusinessEntityInfo(crudSdk)(
      fixtures.rkeeperUnit?.externalRestaurantId ?? 'Something is wrong',
    )
      .pipe(
        switchMap(businessEntityInfo =>
          createDefaultProductCategory(crudSdk)(businessEntityInfo).pipe(
            tap(res => expect(res).toMatchSnapshot('product category created')),
            switchMap(() =>
              createDefaultProductCategory(crudSdk)(businessEntityInfo),
            ),
            tap(res =>
              expect(res).toMatchSnapshot('product category recreated'),
            ),
          ),
        ),
      )
      .subscribe(() => done());
  }, 15000);
});
