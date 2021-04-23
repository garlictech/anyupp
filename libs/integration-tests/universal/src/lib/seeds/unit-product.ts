import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { resultTap } from './seed.util';

export const deleteUnitProduct = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteUnitProductMutation>(
    CrudApiMutationDocuments.deleteUnitProduct,
    {
      input: { id },
    },
  ).pipe(resultTap('UNIT_PRODUCT delete', id));
