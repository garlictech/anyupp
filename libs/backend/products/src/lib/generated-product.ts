import { tableConfig } from '@bgap/crud-gql/backend';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createItems, deleteItems } from '@bgap/anyupp-backend-lib';
import { CrudSdk } from '@bgap/crud-gql/api';
import {
  CreateGeneratedProductInput,
  GeneratedProduct,
  SearchGeneratedProductsQueryVariables,
} from '@bgap/domain';

const TABLE_NAME = tableConfig.GeneratedProduct.TableName;

export const deleteGeneratedProductsForAUnitFromDb =
  (crudSdk: CrudSdk) => (unitId: string) => {
    return listGeneratedProductsForUnits(crudSdk)([unitId]).pipe(
      switchMap(items =>
        items.length > 0
          ? deleteGeneratedProductsItemsFromDb(items.map(item => item.id))
          : of([]),
      ),
    );
  };

export const deleteGeneratedProductsItemsFromDb = (itemIds: string[]) =>
  deleteItems(TABLE_NAME)(itemIds.map(id => ({ id })));

export const createGeneratedProductsInDb = (
  products: CreateGeneratedProductInput[],
) => {
  return createItems(TABLE_NAME)(products);
};

export const listGeneratedProductsForUnits =
  (crudSdk: CrudSdk) =>
  (unitIds: string[]): Observable<Array<GeneratedProduct>> => {
    const input: SearchGeneratedProductsQueryVariables = {
      filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
    };

    return getAllPaginatedData(crudSdk.SearchGeneratedProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(filterNullishGraphqlListWithDefault<GeneratedProduct>([]));
  };
