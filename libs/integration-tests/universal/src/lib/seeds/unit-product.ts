import { AmplifySdk } from 'libs/crud-gql/api/src';
import { from, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const deleteUnitProduct = (id: string) => (crudSdk: AmplifySdk) =>
  from(
    crudSdk.DeleteUnitProduct({
      input: { id },
    }),
  ).pipe(
    tap({
      next(unit) {
        console.log('### UNIT_PRODUCT deleted with id: ' + unit?.id);
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
