import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { resultTap } from './seed.util';

export const createTestUnitProduct = (input: CrudApi.CreateUnitProductInput) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateUnitProductMutation>(
    CrudApiMutationDocuments.createUnitProduct,
    {
      input,
    },
  ).pipe(resultTap('UNIT_PRODUCT create', input.id!));

export const deleteTestUnitProduct = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteUnitProductMutation>(
    CrudApiMutationDocuments.deleteUnitProduct,
    {
      input: { id },
    },
  ).pipe(resultTap('UNIT_PRODUCT delete', id));
