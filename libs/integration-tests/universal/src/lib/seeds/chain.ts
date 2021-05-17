/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestChain = (input: CrudApi.CreateChainInput) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateChainMutation>(
    CrudApiMutationDocuments.createChain,
    {
      input,
    },
  ).pipe(resultTap('CHAIN create', input.id!));

export const deleteTestChain = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteChainMutation>(
    CrudApiMutationDocuments.deleteChain,
    { input: { id } },
  ).pipe(resultTap('CHAIN delete', id));
