/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestGroup = (input: CrudApi.CreateGroupInput) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateGroupMutation>(
    CrudApiMutationDocuments.createGroup,
    {
      input,
    },
  ).pipe(resultTap('GROUP create', input.id!));

export const deleteTestGroup = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteGroupMutation>(
    CrudApiMutationDocuments.deleteGroup,
    { input: { id } },
  ).pipe(resultTap('GROUP delete', id));
