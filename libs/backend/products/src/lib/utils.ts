import * as CrudApi from '@bgap/crud-gql/api';
import { CrudSdk } from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Observable } from 'rxjs';

export interface ProductResolverDeps {
  crudSdk: CrudSdk;
  unitProductTableName: string;
  chainProductTableName: string;
  groupProductTableName: string;
  docClient: DocumentClient;
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
    }).pipe(filterNullishGraphqlListWithDefault<CrudApi.GroupProduct>([]));
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
    }).pipe(filterNullishGraphqlListWithDefault<CrudApi.UnitProduct>([]));
  };
