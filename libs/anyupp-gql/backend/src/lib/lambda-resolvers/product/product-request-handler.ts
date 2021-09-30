import * as CrudApi from '@bgap/crud-gql/api';
import { updateChainProduct } from './chain-product.resolver';
import { updateGroupProduct } from './group-product.resolver';
import {
  createUnitProduct,
  deleteUnitProduct,
  updateUnitProduct,
} from './unit-product.resolver';
import { ProductResolverDeps } from './utils';

// HANDLER
export const productRequestHandler = (deps: ProductResolverDeps) => ({
  // CHAIN PRODUCT
  updateChainProduct: (
    requestPayload: CrudApi.UpdateChainProductMutationVariables,
  ) => updateChainProduct(deps)(requestPayload.input).toPromise(),
  // GROUP PRODUCT
  updateGroupProduct: (
    requestPayload: CrudApi.UpdateGroupProductMutationVariables,
  ) => updateGroupProduct(deps)(requestPayload.input).toPromise(),
  // UNIT PRODUCT
  createUnitProduct: (
    requestPayload: CrudApi.CreateUnitProductMutationVariables,
  ) => createUnitProduct(deps)(requestPayload.input).toPromise(),
  updateUnitProduct: (
    requestPayload: CrudApi.UpdateUnitProductMutationVariables,
  ) => updateUnitProduct(deps)(requestPayload.input).toPromise(),
  deleteUnitProduct: (
    requestPayload: CrudApi.DeleteUnitProductMutationVariables,
  ) => deleteUnitProduct(deps)(requestPayload.input.id).toPromise(),
});
