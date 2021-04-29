import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { resultTap } from './seed.util';

export const createTestGeneratedProduct = (
  input: CrudApi.CreateGeneratedProductInput,
) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.CreateGeneratedProductMutation
  >(CrudApiMutationDocuments.createGeneratedProduct, {
    input,
  }).pipe(resultTap('GENERATED_PRODUCT create', input.id!));

export const deleteTestGeneratedProduct = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<
    CrudApi.DeleteGeneratedProductMutation
  >(CrudApiMutationDocuments.deleteGeneratedProduct, {
    input: { id },
  }).pipe(
    resultTap('GENERATED_PRODUCT delete', id),
    catchError(() => of('NO_PROBLEM')),
  );
