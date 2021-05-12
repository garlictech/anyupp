import { unitSeed } from '../fixtures/unit';
import { tap, catchError } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import * as CrudApi from '@bgap/crud-gql/api';

export const createTestUnit = (
  overwrites: Partial<CrudApi.CreateUnitInput> = {},
) => (crudSdk: CrudApi.AmplifySdk) =>
  from(
    crudSdk.CreateUnit({
      input: {
        ...unitSeed.unit_01,
        ...overwrites,
      },
    }),
  ).pipe(
    tap({
      next(unit) {
        console.log('### new UNIT created with id: ' + unit?.id);
      },
      error(err) {
        console.error('Error during test unit creation: ', err.message);
      },
    }),
  );

export const deleteTestUnit = (id: string = unitSeed.unit_01.id!) => (
  crudSdk: CrudApi.AmplifySdk,
) =>
  from(
    crudSdk.DeleteUnit({
      input: { id },
    }),
  ).pipe(
    tap({
      next(unit) {
        console.log('### UNIT deleted with id: ' + unit?.id);
      },
    }),
    catchError(err => {
      console.error('Error during unit delete with id:' + id, err.message);
      return throwError(
        `Error during unit delete with id: ${id}, Err: ${err.message}`,
      );
    }),
  );
