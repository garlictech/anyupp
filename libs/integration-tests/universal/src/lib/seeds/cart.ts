import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

import { resultTap } from './seed.util';

export const createTestCart = (input: CrudApi.CreateCartInput) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateCartMutation>(
    CrudApiMutationDocuments.createCart,
    { input },
  ).pipe(resultTap('CART create', input.id!));

export const deleteTestCart = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteCartMutation>(
    CrudApiMutationDocuments.deleteCart,
    {
      input: { id },
    },
  ).pipe(resultTap('CART delete', id));
