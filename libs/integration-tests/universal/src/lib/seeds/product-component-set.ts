import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { resultTap } from './seed.util';

export const createTestProductComponentSet = (
  input: CrudApi.CreateProductComponentSetInput,
) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.CreateProductComponentSetMutation
  >(CrudApiMutationDocuments.createProductComponentSet, {
    input,
  }).pipe(resultTap('PRODUCT_COMPONENT_SET create', input.id!));

export const deleteTestProductComponentSet = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.DeleteProductComponentSetMutation
  >(CrudApiMutationDocuments.deleteProductComponentSet, {
    input: { id },
  }).pipe(resultTap('PRODUCT_COMPONENT_SET delete', id));

export const createTestProductComponent = (
  input: CrudApi.CreateProductComponentInput,
) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.CreateProductComponentMutation
  >(CrudApiMutationDocuments.createProductComponent, {
    input,
  }).pipe(resultTap('PRODUCT_COMPONENT create', input.id!));

export const deleteTestProductComponent = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.DeleteProductComponentMutation
  >(CrudApiMutationDocuments.deleteProductComponent, {
    input: { id },
  }).pipe(resultTap('PRODUCT_COMPONENT delete', id));
