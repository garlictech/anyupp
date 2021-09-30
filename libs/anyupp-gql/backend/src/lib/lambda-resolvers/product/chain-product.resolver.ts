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
import { throwIfEmptyValue } from '@bgap/shared/utils';

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
        concatMap(unitId => deps.regenerateUnitDataHandler(unitId)), // concatMap will wait all the regen calls to finish
        takeLast(1),
        mapTo(chainProduct),
        defaultIfEmpty(chainProduct),
      ),
    ),
  );

export const updateChainProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.UpdateChainProductInput): Observable<CrudApi.ChainProduct> =>
    defer(() => deps.crudSdk.UpdateChainProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnChainProductPipe(deps),
    );
