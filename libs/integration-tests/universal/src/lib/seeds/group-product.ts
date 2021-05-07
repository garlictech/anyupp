import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { resultTap } from './seed.util';

export const createTestGroupProduct = (
  input: CrudApi.CreateGroupProductInput,
) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateGroupProductMutation>(
    CrudApiMutationDocuments.createGroupProduct,
    {
      input,
    },
  ).pipe(resultTap('GROUP_PRODUCT create', input.id!));

export const deleteTestGroupProduct = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteGroupProductMutation>(
    CrudApiMutationDocuments.deleteGroupProduct,
    { input: { id } },
  ).pipe(
    resultTap('CHAIN_PRODUCT delete', id),
    catchError(() => of('NO_PROBLEM')),
  );
