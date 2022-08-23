import * as fastify from 'fastify';
import { searchExternalVariant, sendRkeeperOrder } from '@bgap/rkeeper-api';
import axios, { AxiosError } from 'axios';
import { ECS } from 'aws-sdk';
import * as R from 'ramda';
import * as fs from 'fs';

import { createIamCrudSdk } from '../../../api-clients';
import {
  mergeMap,
  switchMap,
  delay,
  tap,
  switchMapTo,
  takeLast,
  toArray,
  map,
  count,
  catchError,
} from 'rxjs/operators';
import {
  createRkeeperProduct,
  updateRkeeperProduct,
  getBusinessEntityInfo,
  handleRkeeperProducts,
  createDefaultProductCategory,
  defaultProductCategoryId,
  handleProducts,
  menusyncHandler,
} from '@bgap/rkeeper-api';
import { from, Observable, of, defer, forkJoin } from 'rxjs';
import { ES_DELAY, dateMatcher } from '../../../utils';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';
import * as fixtures from './fixtures';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { v1 as uuidV1 } from 'uuid';
import {
  config,
  commonStackConfig,
  anyuppStackConfig,
} from '@bgap/shared/config';
import { maskAll, maskDate, maskV4UuidIds } from '@bgap/shared/fixtures';
import {
  Maybe,
  ProductComponent,
  ProductComponentSet,
  ProductConfigSet,
  UnitProduct,
} from '@bgap/domain';
import { deleteTestUnitProduct } from '../../seeds/unit-product';

const commonBackendName = 'common-backend2-anyupp';
const crudSdk = createIamCrudSdk();

describe('Test the rkeeper api basic functionality', () => {
  const testItemDeleter = <Y extends { id: string }, FILTER>(
    searchOp: (x: { filter: FILTER }) => Observable<
      | {
          items?: Maybe<Array<Maybe<Y>>>;
        }
      | undefined
      | null
    >,
    deleteOp: (x: { input: { id: string } }) => any,
    filter: FILTER,
  ) =>
    getAllPaginatedData(searchOp, {
      query: { filter },
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

  const dirtyItemDeleter = <Y extends { id: string }>(
    searchOp: (x: { filter: { dirty: { eq: boolean } } }) => Observable<
      | {
          items?: Maybe<Array<Maybe<Y>>>;
        }
      | undefined
      | null
    >,
    deleteOp: (x: { input: { id: string } }) => any,
  ) => testItemDeleter(searchOp, deleteOp, { dirty: { eq: true } });

  const cleanup$ = forkJoin([
    dirtyItemDeleter(crudSdk.SearchUnitProducts, crudSdk.DeleteUnitProduct),
  ]).pipe(
    switchMap(() =>
      from([fixtures.rkeeperUnitProduct, fixtures.rkeeperUnitProduct2]),
    ),
    mergeMap(item => deleteTestUnitProduct(item, crudSdk), 100),
    mergeMap(
      () =>
        crudSdk.DeleteProductCategory({
          input: {
            id: defaultProductCategoryId({
              unitId: fixtures.rkeeperUnit.id,
            }),
          },
        }),
      100,
    ),
    count(),
    tap(num => console.log(`${num} deleted items`)),
    switchMap(() =>
      forkJoin([
        crudSdk.DeleteUnit({ input: { id: fixtures.rkeeperUnit.id } }),
      ]),
    ),
    tap(result => console.log(`${result} deleted items`)),
  );

  beforeEach(done => {
    jest.resetModules();

    of(1)
      .pipe(
        delay(ES_DELAY),
        switchMap(() => cleanup$),
        delay(ES_DELAY),
        switchMapTo(
          from([fixtures.rkeeperUnitProduct, fixtures.rkeeperUnitProduct2]),
        ),
        mergeMap(input => crudSdk.CreateUnitProduct({ input })),
        takeLast(1),
        switchMap(() =>
          forkJoin([crudSdk.CreateUnit({ input: fixtures.rkeeperUnit })]),
        ),
        delay(ES_DELAY),
      )
      .subscribe(() => done());
  }, 65000);

  afterAll(done => {
    cleanup$.subscribe(() => done());
  }, 60000);

  test('It shouls be able to search for external variant', done => {
    searchExternalVariant(crudSdk)(fixtures.rkeeperProductGuid)
      .pipe(
        tap(res =>
          expect(res?.id).toMatchSnapshot('existing external product'),
        ),
        switchMap(() => searchExternalVariant(crudSdk)('NOT EXISTING PRODUCT')),
        tap(res =>
          expect(res).toMatchSnapshot('NOT existing external product'),
        ),
      )
      .subscribe(() => done());
  }, 100000);

  test('Create products by an rkeeper product', done => {
    createRkeeperProduct(crudSdk)(
      fixtures.businessEntity,
      fixtures.processedDish,
      [],
    )
      .pipe(
        delay(ES_DELAY),
        switchMap(() =>
          forkJoin([
            crudSdk
              .SearchUnitProducts({
                filter: {
                  and: [
                    {
                      dirty: { eq: true },
                      unitId: { eq: fixtures.businessEntity.unitId },
                    },
                  ],
                },
              })
              .pipe(
                filterNullishGraphqlListWithDefault<UnitProduct>([]),
                tap(res =>
                  expect(maskAll(res)).toMatchSnapshot('UNITPRODUCTST'),
                ),
              ),
          ]),
        ),
        map(([unitProducts]) => unitProducts[0]),
        switchMap(unitProduct =>
          updateRkeeperProduct(crudSdk)(
            { ...fixtures.processedDish, name: 'NEW NAME', price: 1000000 },
            unitProduct,
            [],
          ),
        ),
        tap(res =>
          expect(maskAll(res)).toMatchSnapshot('update rkeeper product'),
        ),
      )
      .subscribe(() => done());
  }, 60000);

  test('getBusinessEntityInfo - not existing restaurant', done => {
    getBusinessEntityInfo(crudSdk)('NOT EXISTING RESTO`').subscribe({
      error: (err: unknown) => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  }, 60000);

  test('getBusinessEntityInfo - existing restaurant', done => {
    getBusinessEntityInfo(crudSdk)(
      fixtures.rkeeperUnit.externalId ?? 'something is wrong',
    ).subscribe({
      next: result => {
        expect(result).toMatchSnapshot();
        done();
      },
    });
  }, 60000);

  test('Test full rkeeper product handling - not not existing unit', done => {
    handleRkeeperProducts(crudSdk)('NOT EXISTING RESTAURANT')(
      fixtures.rawData,
    ).subscribe({
      error: err => {
        expect(err).toMatchSnapshot();
        done();
      },
    });
  }, 60000);

  test('Test full rkeeper product handling - the use case', done => {
    const createMatcher =
      (matcher: Record<string, unknown>) =>
      (label: string) =>
      (result: any[]) =>
        pipe(
          result,
          maskV4UuidIds,
          maskDate,
          R.sortBy(JSON.stringify),
          R.forEach(res => expect(res).toMatchSnapshot(matcher, label)),
        );

    const checkMatches = createMatcher(dateMatcher);

    const sortConfigSets = <
      T extends {
        items?: Maybe<ProductConfigSet>;
      },
    >(
      sets: Maybe<T>[],
    ) =>
      pipe(
        sets,
        R.map(configSet => ({
          ...configSet,
          items: configSet?.items
            ? pipe(
                (configSet?.items ?? []) as Maybe<ProductConfigSet>[],
                R.reject(R.isNil),
                R.sortBy(JSON.stringify),
              )
            : R.identity,
        })),
        R.sortBy(JSON.stringify),
      );

    const processProducts = <
      K,
      T extends {
        configSets?: Maybe<Maybe<K>[]>;
      },
    >(
      products: T[],
    ) =>
      pipe(
        products,
        maskV4UuidIds,
        R.map(product => ({
          ...product,
          configSets: product.configSets
            ? sortConfigSets(product.configSets)
            : product.configSets,
        })),
        R.sortBy(JSON.stringify),
      );

    handleRkeeperProducts(crudSdk)(
      fixtures.rkeeperUnit?.externalId ?? 'Something is wrong',
    )(fixtures.rawData)
      .pipe(
        delay(ES_DELAY),
        switchMap(() =>
          crudSdk.SearchUnitProducts({
            filter: { unitId: { eq: fixtures.rkeeperUnit.id } },
          }),
        ),
        filterNullishGraphqlListWithDefault<UnitProduct>([]),
        map(res => processProducts<ProductConfigSet, UnitProduct>(res)),
        tap(checkMatches('Unit products')),
        switchMap(() =>
          crudSdk.SearchProductComponents({
            filter: { ownerEntity: { eq: fixtures.rkeeperUnit.id } },
          }),
        ),
        filterNullishGraphqlListWithDefault<ProductComponent>([]),
        tap(checkMatches('Product components')),
        switchMap(() =>
          crudSdk.SearchProductComponentSets({
            filter: { ownerEntity: { eq: fixtures.rkeeperUnit.id } },
          }),
        ),
        filterNullishGraphqlListWithDefault<ProductComponentSet>([]),
        tap(checkMatches('Product component sets')),
      )
      .subscribe({
        next: () => done(),
      });
  }, 60000);

  // We skip this extremely long-running test by default
  test.skip('Test full rkeeper product handling - the use case with lots of records', done => {
    const rawData = JSON.parse(
      fs.readFileSync(__dirname + '/menu-data.json').toString(),
    );

    handleRkeeperProducts(crudSdk)(fixtures.yellowRestaurantId)(
      rawData,
    ).subscribe({
      next: result => {
        expect(result).toMatchSnapshot();
        done();
      },
    });
  }, 720000);

  test('Test the menusync handler', async () => {
    const rawData = JSON.parse(
      fs.readFileSync(__dirname + '/menu-data.json').toString(),
    );

    const res = await menusyncHandler(crudSdk)(
      {
        params: { externalUnitId: fixtures.yellowRestaurantId },
        body: rawData,
      } as any,
      {
        send: () => {
          /* EMPTY */
        },
      } as any,
    );

    expect(res).toMatchSnapshot();
  }, 60000);

  test('Test the product handling logic in fargate in case of non-existing unit', done => {
    const deps = {
      ecs: new ECS({ apiVersion: '2014-11-13' }),
      RKeeperProcessProductSubnet:
        commonStackConfig[commonBackendName].AnyuppVpcSubnetOutput,
      RKeeperProcessProductSecurityGroup:
        commonStackConfig[commonBackendName].AnyuppVpcSecurityGroupOutput,
      taskDefinitionArn: config.RkeeperTaskDefinitionArn,
      bucketName:
        anyuppStackConfig['anyupp-backend-rkeeper'].RKeeperTaskBucketName,
      uuidGenerator: uuidV1,
      sdk: crudSdk,
    };

    handleProducts(deps)('foobar', {})
      .pipe(tap(result => expect(result.failures).toMatchSnapshot()))
      .subscribe(
        () => {
          throw 'THIS TEST MUST THROW ERROR';
        },
        error => {
          expect(error).toMatchSnapshot();
          done();
        },
      );
  }, 10000);

  test('createDefaultProductCategory', done => {
    getBusinessEntityInfo(crudSdk)(
      fixtures.rkeeperUnit?.externalId ?? 'Something is wrong',
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
            switchMap(() =>
              crudSdk.GetProductCategory({
                id: defaultProductCategoryId(businessEntityInfo),
              }),
            ),
            tap(res =>
              expect(res).toMatchSnapshot(dateMatcher, 'product category data'),
            ),
          ),
        ),
      )
      .subscribe(() => done());
  }, 60000);
});

test('send order to rkeeper by HTTP post', done => {
  defer(() =>
    from(
      axios.request({
        url: `${fixtures.rkeeperEndpoint}/postorder/${fixtures.yellowRestaurantId}`,
        method: 'post',
        data: fixtures.rkeeperOrder,
        auth: {
          username: fixtures.yellowRkeeperUsername,
          password: fixtures.yellowRkeeperPassword,
        },
      }),
    ),
  )
    .pipe(
      tap(result => {
        expect(result?.config.auth).toMatchSnapshot('config.auth');
        expect(result?.data.success).toEqual(true);
      }),
    )
    .subscribe({
      next: () => console.log,
      error: error => {
        console.error('Error', error);
        throw error;
      },
      complete: () => done(),
    });
}, 60000);

test('send order to rkeeper by sendRkeeperOrder', done => {
  sendRkeeperOrder({
    axiosInstance: axios,
    currentTimeISOString: () => new Date('2040.01.01').toISOString(),
    uuidGenerator: () => 'UUID',
  })(fixtures.yellowUnit, fixtures.orderInput)
    .pipe(
      tap(result => {
        expect(result.externalId).toEqual('UUID');
        expect(!!result.visitId).toBeTruthy();
      }),
    )
    .subscribe({
      next: () => console.log,
      error: error => {
        console.error('Error', error);
        throw error;
      },
      complete: () => done(),
    });
}, 60000);

test('send an unpaid order to rkeeper by HTTP post, then send another request to set it to Paid status', done => {
  defer(() =>
    from(
      axios.request({
        url: `${fixtures.rkeeperEndpoint}/postorder/${fixtures.yellowRestaurantId}`,
        method: 'post',
        data: {
          ...fixtures.rkeeperOrder,
          pay_online_type: 1,
        },
        auth: {
          username: fixtures.yellowRkeeperUsername,
          password: fixtures.yellowRkeeperPassword,
        },
      }),
    ),
  )
    .pipe(
      tap(postOrderResponse =>
        expect(postOrderResponse?.config.auth).toMatchSnapshot('config.auth'),
      ),
      map(postOrderResponse => postOrderResponse.data),
      tap(postOrderResponseData => {
        console.log(
          'postOrderResponseData',
          JSON.stringify(postOrderResponseData),
        );
        expect(postOrderResponseData.success).toEqual(true);
      }),
      switchMap(postOrderResponseData =>
        from(
          axios.request({
            url: `${fixtures.rkeeperEndpoint}/postorder/payed/${fixtures.yellowRestaurantId}/${postOrderResponseData.data.data['visit_id']}`,
            method: 'post',
            auth: {
              username: fixtures.yellowRkeeperUsername,
              password: fixtures.yellowRkeeperPassword,
            },
          }),
        ).pipe(
          tap(postPayedResponse =>
            expect(postPayedResponse?.config.auth).toMatchSnapshot(
              'config.auth',
            ),
          ),
          map(postPayedResponse => postPayedResponse.data),
          tap(postPayedResponseData => {
            console.log(
              'postPayedResponseData',
              JSON.stringify(postPayedResponseData),
            );
            expect(postPayedResponseData.success).toEqual(true);
          }),
        ),
      ),
    )
    .subscribe({
      next: () => console.log,
      error: error => {
        console.error('Error', error);
        throw error;
      },
      complete: () => done(),
    });
}, 60000);

test('test the menusync route - reply with unit not found', done => {
  const url = `${anyuppStackConfig['anyupp-backend-rkeeper'].rkeeperwebhookEndpoint}/foobar/menusync`;

  defer(() =>
    from(
      axios.request({
        url,
        method: 'post',
        data: {},
      }),
    ),
  ).subscribe({
    next: res => {
      console.warn(res);
      throw 'MUST BE ERRORED';
    },
    error: (error: AxiosError) => {
      expect(error.response?.data).toMatchSnapshot();
      expect(error.response?.status).toEqual(400);
      done();
    },
    complete: () => done(),
  });
}, 30000);

test('test the menusync handler - reply with unit not found', done => {
  defer(() => from(menusyncHandler(crudSdk)({} as any, {} as any))).subscribe({
    next: res => {
      console.warn(res);
      throw 'MUST BE ERRORED';
    },
    error: (error: AxiosError) => {
      console.warn(error);
      expect(error.response?.data).toMatchSnapshot();
      expect(error.response?.status).toEqual(400);
      done();
    },
    complete: () => done(),
  });
}, 30000);

test.only('test the order status route - reply with unit not found', done => {
  const url = `${anyuppStackConfig['anyupp-backend-rkeeper'].rkeeperwebhookEndpoint}/foobar/order-status`;

  defer(() =>
    from(
      axios.request({
        url,
        method: 'post',
        data: {
          remoteOrderId: 'REMOTE ORDER ID',
          currentState: 'served',
        },
      }),
    ),
  )
    .pipe(
      catchError(x => of(x)),
      tap((result: AxiosError) => {
        expect(result.response?.data).toMatchSnapshot();
        expect(result.response?.status).toEqual(400);
      }),
    )
    .subscribe({
      next: () => console.log,
      error: error => {
        console.error('Error', error);
        throw error;
      },
      complete: () => done(),
    });
}, 60000);
