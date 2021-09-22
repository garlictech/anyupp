import * as CrudApi from '@bgap/crud-gql/api';
import { CrudSdk } from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  validateGroupProductList,
  validateUnitProductList,
} from '@bgap/shared/data-validators';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RegenerateUnitDataHandler } from '../unit/utils';

export interface ProductResolverDeps {
  crudSdk: CrudSdk;
  regenerateUnitDataHandler: RegenerateUnitDataHandler;
}

export const getUnitIdsFromUnitProductList = (
  unitProducts: CrudApi.UnitProduct[],
) => unitProducts.map(unitProduct => unitProduct.unitId);

export const listGroupProductsForChainProductParent =
  (crudSdk: CrudApi.CrudSdk) =>
  (chainProductId: string): Observable<Array<CrudApi.GroupProduct>> => {
    const input: CrudApi.SearchGroupProductsQueryVariables = {
      filter: { parentId: { eq: chainProductId } },
    };

    return getAllPaginatedData(crudSdk.SearchGroupProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      switchMap(validateGroupProductList),
      filterNullishGraphqlListWithDefault<CrudApi.GroupProduct>([]),
    );
  };

export const listUnitProductsForGroupProductParents =
  (crudSdk: CrudApi.CrudSdk) =>
  (groupProductIds: string[]): Observable<Array<CrudApi.UnitProduct>> => {
    const input: CrudApi.SearchUnitProductsQueryVariables = {
      filter: { or: groupProductIds.map(x => ({ parentId: { eq: x } })) },
    };

    return getAllPaginatedData(crudSdk.SearchUnitProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      switchMap(validateUnitProductList),
      filterNullishGraphqlListWithDefault<CrudApi.UnitProduct>([]),
    );
  };
