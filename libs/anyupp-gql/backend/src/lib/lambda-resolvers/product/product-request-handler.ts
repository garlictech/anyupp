import * as AnyuppApi from '@bgap/anyupp-gql/api';
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
    requestPayload: AnyuppApi.UpdateChainProductMutationVariables,
  ) => updateChainProduct(deps)(requestPayload.input).toPromise(),
  // GROUP PRODUCT
  updateGroupProduct: (
    requestPayload: AnyuppApi.UpdateGroupProductMutationVariables,
  ) => updateGroupProduct(deps)(requestPayload.input).toPromise(),
  // UNIT PRODUCT
  createUnitProduct: (
    requestPayload: AnyuppApi.CreateUnitProductMutationVariables,
  ) => createUnitProduct(deps)(requestPayload.input).toPromise(),
  updateUnitProduct: (
    requestPayload: AnyuppApi.UpdateUnitProductMutationVariables,
  ) => updateUnitProduct(deps)(requestPayload.input).toPromise(),
  deleteUnitProduct: (
    requestPayload: AnyuppApi.DeleteUnitProductMutationVariables,
  ) => deleteUnitProduct(deps)(requestPayload.id).toPromise(),
});
