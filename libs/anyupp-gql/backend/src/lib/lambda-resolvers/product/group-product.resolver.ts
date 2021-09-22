import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateGroupProduct } from '@bgap/shared/data-validators';
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
  listUnitProductsForGroupProductParents,
  ProductResolverDeps,
} from './utils';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const callRegenerateOnGroupProductPipe = (deps: ProductResolverDeps) =>
  pipe(
    switchMap(validateGroupProduct),
    switchMap(groupProduct =>
      listUnitProductsForGroupProductParents(deps.crudSdk)([
        groupProduct.id,
      ]).pipe(
        map(getUnitIdsFromUnitProductList),
        switchMap(unitIds => from(unitIds)),
        concatMap(unitId => deps.regenerateUnitDataHandler(unitId)), // concatMap will wait all the regen calls to finish
        takeLast(1),
        mapTo(groupProduct),
        defaultIfEmpty(groupProduct),
      ),
    ),
  );

export const updateGroupProduct =
  (deps: ProductResolverDeps) =>
  (
    input: AnyuppApi.UpdateGroupProductInput,
  ): Observable<CrudApi.GroupProduct> =>
    defer(() => deps.crudSdk.UpdateGroupProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnGroupProductPipe(deps),
    );
