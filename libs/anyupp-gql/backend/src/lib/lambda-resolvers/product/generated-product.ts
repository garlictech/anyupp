import { defer, iif, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import { validateGeneratedProductList } from '@bgap/shared/data-validators';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';

import { createItems, deleteItems } from '../../database';
import { UnitsResolverDeps } from '../unit/utils';

const TABLE_NAME = tableConfig.GeneratedProduct.TableName;

export const deleteGeneratedProductsForAUnitFromDb =
  (deps: UnitsResolverDeps) => (unitId: string) => {
    return listGeneratedProductsForUnits(deps)([unitId]).pipe(
      switchMap(items =>
        iif(
          () => items.length > 0,
          deleteGeneratedProductsItemsFromDb(items),
          of([]),
        ),
      ),
    );
  };
const deleteGeneratedProductsItemsFromDb = (
  items: CrudApi.GeneratedProduct[],
) => deleteItems(TABLE_NAME)(items);

export const createGeneratedProductsInDb = (
  products: CrudApi.CreateGeneratedProductInput[],
) => {
  return createItems(TABLE_NAME)(products);
};

export const listGeneratedProductsForUnits =
  (deps: UnitsResolverDeps) =>
  (unitIds: string[]): Observable<Array<CrudApi.GeneratedProduct>> => {
    const input: CrudApi.ListGeneratedProductsQueryVariables = {
      filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
      limit: 200,
    };

    return defer(() =>
      deps.crudSdk.ListGeneratedProducts(input, { fetchPolicy: 'no-cache' }),
    ).pipe(
      switchMap(validateGeneratedProductList),
      filterNullishGraphqlListWithDefault<CrudApi.GeneratedProduct>([]),
    );
  };
