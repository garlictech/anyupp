import { CrudSdk } from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import { filterNullishGraphqlListWithDefault } from '@bgap/shared/utils';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  GroupProduct,
  SearchGroupProductsQueryVariables,
  SearchUnitProductsQueryVariables,
  UnitProduct,
} from '@bgap/domain';
import { Observable } from 'rxjs';

export interface ProductResolverDeps {
  crudSdk: CrudSdk;
  unitProductTableName: string;
  chainProductTableName: string;
  groupProductTableName: string;
  docClient: DocumentClient;
}

export const getUnitIdsFromUnitProductList = (unitProducts: UnitProduct[]) =>
  unitProducts.map(unitProduct => unitProduct.unitId);

export const listGroupProductsForChainProductParent =
  (crudSdk: CrudSdk) =>
  (chainProductId: string): Observable<Array<GroupProduct>> => {
    const input: SearchGroupProductsQueryVariables = {
      filter: { parentId: { eq: chainProductId } },
    };

    return getAllPaginatedData(crudSdk.SearchGroupProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(filterNullishGraphqlListWithDefault<GroupProduct>([]));
  };

export const listUnitProductsForGroupProductParents =
  (crudSdk: CrudSdk) =>
  (groupProductIds: string[]): Observable<Array<UnitProduct>> => {
    const input: SearchUnitProductsQueryVariables = {
      filter: { or: groupProductIds.map(x => ({ parentId: { eq: x } })) },
    };

    return getAllPaginatedData(crudSdk.SearchUnitProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(filterNullishGraphqlListWithDefault<UnitProduct>([]));
  };
