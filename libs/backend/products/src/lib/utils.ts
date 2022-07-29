import { CrudSdk } from '@bgap/crud-gql/api';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { UnitProduct } from '@bgap/domain';

export interface ProductResolverDeps {
  crudSdk: CrudSdk;
  unitProductTableName: string;
  chainProductTableName: string;
  groupProductTableName: string;
  docClient: DocumentClient;
}

export const getUnitIdsFromUnitProductList = (unitProducts: UnitProduct[]) =>
  unitProducts.map(unitProduct => unitProduct.unitId);
