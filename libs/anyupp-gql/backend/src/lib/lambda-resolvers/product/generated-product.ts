import * as fp from 'lodash/fp';
import { from, iif, Observable, of } from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { IGeneratedProduct } from '@bgap/shared/types';
import { tableConfig } from '@bgap/crud-gql/backend';

import { createItems, deleteItems } from '../../database';
import { UnitsResolverDeps } from '../unit/utils';

const TABLE_NAME = tableConfig.GeneratedProduct.TableName;

export const deleteGeneratedProductsForAUnit = (unitId: string) => (
  deps: UnitsResolverDeps,
) => {
  return listGeneratedProductsForUnits([unitId])(deps).pipe(
    switchMap(items =>
      iif(() => items.length > 0, deleteGeneratedProductsItems(items), of([])),
    ),
  );
};
const deleteGeneratedProductsItems = (items: IGeneratedProduct[]) =>
  deleteItems(TABLE_NAME)(items);

export const createGeneratedProducts = (
  products: CrudApi.CreateGeneratedProductInput[],
) => {
  return createItems(TABLE_NAME)(products);
};

export const listGeneratedProductsForUnits = (unitIds: string[]) => (
  deps: UnitsResolverDeps,
): Observable<IGeneratedProduct[]> => {
  const input: CrudApi.ListGeneratedProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };

  return from(
    deps.crudSdk.ListGeneratedProducts(input, { fetchPolicy: 'no-cache' }),
  ).pipe(
    map(x => x?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    // TODO: switchMap((items: []) => combineLatest(items.map(validateUnit))),
  );
};
