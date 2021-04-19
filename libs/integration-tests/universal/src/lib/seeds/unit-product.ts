import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import {
  crudGraphqlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

export const deleteUnitProduct = (id: string) =>
  executeMutation(crudGraphqlClient)<CrudApi.DeleteUnitProductMutation>(
    CrudApiMutationDocuments.deleteUnitProduct,
    {
      input: { id },
    },
  ).pipe(
    tap({
      next(unit) {
        console.log(
          '### UNIT_PRODUCT deleted with id: ' + unit.deleteUnitProduct?.id,
        );
      },
    }),
    catchError(err => {
      console.error(
        'Error during unit product delete with id:' + id,
        err.message,
      );
      return throwError(
        `Error during unit product delete with id: ${id}, Err: ${err.message}`,
      );
    }),
  );
