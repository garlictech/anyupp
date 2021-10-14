import * as CrudApi from '@bgap/crud-gql/api';
import { defer, from, Observable, pipe } from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  delay,
  map,
  mapTo,
  switchMap,
  takeLast,
} from 'rxjs/operators';
import {
  getUnitIdsFromUnitProductList,
  listGroupProductsForChainProductParent,
  listUnitProductsForGroupProductParents,
  ProductResolverDeps,
} from './utils';
import { throwIfEmptyValue, createUpdateParams } from '@bgap/shared/utils';
import { pipe as fpPipe } from 'fp-ts/lib/function';
import { regenerateUnitData } from '../unit';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const collectGroupProductIds = (groupProducts: CrudApi.GroupProduct[]) =>
  groupProducts.reduce((prev, curr) => [...prev, curr.id], [] as string[]);

const callRegenerateOnChainProductPipe = (deps: ProductResolverDeps) =>
  pipe(
    throwIfEmptyValue<CrudApi.ChainProduct>(),
    switchMap(chainProduct =>
      listGroupProductsForChainProductParent(deps.crudSdk)(
        chainProduct.id,
      ).pipe(
        map(collectGroupProductIds),
        switchMap(groupProductIds =>
          listUnitProductsForGroupProductParents(deps.crudSdk)(groupProductIds),
        ),
        map(getUnitIdsFromUnitProductList),
        switchMap(unitIds => from(unitIds)),
        concatMap(unitId => regenerateUnitData(deps.unitsDeps)(unitId)), // concatMap will wait all the regen calls to finish
        takeLast(1),
        mapTo(chainProduct),
        defaultIfEmpty(chainProduct),
      ),
    ),
  );

export const updateChainProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.UpdateChainProductInput): Observable<CrudApi.ChainProduct> =>
    defer(() =>
      fpPipe(
        createUpdateParams(deps.chainProductTableName, input.id, {
          ...input,
          updatedAt: new Date().toISOString(),
        }),
        params => from(deps.docClient.update(params).promise()),
      ),
    ).pipe(
      map(res => res.Attributes as CrudApi.ChainProduct),
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnChainProductPipe(deps),
    );
