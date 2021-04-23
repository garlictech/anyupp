/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { cartSeed } from '../fixtures/cart';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestCart = (input: Partial<CrudApi.CreateCartInput>) =>
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
