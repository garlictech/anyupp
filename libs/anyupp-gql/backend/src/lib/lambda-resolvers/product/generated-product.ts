import * as CrudApi from '@bgap/crud-gql/api';
import { tableConfig } from '@bgap/crud-gql/backend';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { iif, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { createItems, deleteItems } from '../../database';

const TABLE_NAME = tableConfig.GeneratedProduct.TableName;

export const deleteGeneratedProductsForAUnitFromDb =
  (crudSdk: CrudApi.CrudSdk) => (unitId: string) => {
    return listGeneratedProductsForUnits(crudSdk)([unitId]).pipe(
      switchMap(items =>
        items.length > 0 ? deleteGeneratedProductsItemsFromDb(items) : of([]),
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
  (crudSdk: CrudApi.CrudSdk) =>
  (unitIds: string[]): Observable<Array<CrudApi.GeneratedProduct>> => {
    const input: CrudApi.SearchGeneratedProductsQueryVariables = {
      filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
    };

    console.log('deleteGeneratedProductsForAUnitFromDb', unitIds);
    return getAllPaginatedData(crudSdk.SearchGeneratedProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(filterNullishGraphqlListWithDefault<CrudApi.GeneratedProduct>([]));
  };
