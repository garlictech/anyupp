import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { resultTap } from './seed.util';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const createTestChainProduct = (
  input: CrudApi.CreateChainProductInput,
) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateChainProductMutation>(
    CrudApiMutationDocuments.createChainProduct,
    {
      input,
    },
  ).pipe(resultTap('CHAIN_PRODUCT create', input.id!));

export const deleteTestChainProduct = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteChainProductMutation>(
    CrudApiMutationDocuments.deleteChainProduct,
    { input: { id } },
  ).pipe(
    resultTap('CHAIN_PRODUCT delete', id),
    catchError(() => of('NO_PROBLEM')),
  );
