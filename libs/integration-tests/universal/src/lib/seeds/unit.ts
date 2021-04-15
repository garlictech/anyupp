/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { unitSeed } from '../fixtures/unit';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  amplifyGraphQlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import {
  AmplifyApi,
  AmplifyApiMutationDocuments,
} from '@bgap/crud-gql/api';

export const createTestUnit = (
  overwrites: Partial<AmplifyApi.CreateUnitInput> = {},
) =>
  executeMutation(amplifyGraphQlClient)<AmplifyApi.CreateUnitMutation>(
    AmplifyApiMutationDocuments.createUnit,
    {
      input: {
        ...unitSeed.unit_01,
        ...overwrites,
      },
    },
  ).pipe(
    tap({
      next(unit) {
        console.log('### new UNIT created with id: ' + unit.createUnit?.id);
      },
      error(err) {
        console.error('Error during test unit creation: ', err.message);
      },
    }),
  );

export const deleteTestUnit = (id: string = unitSeed.unit_01.id!) =>
  executeMutation(amplifyGraphQlClient)<AmplifyApi.DeleteUnitMutation>(
    AmplifyApiMutationDocuments.deleteUnit,
    {
      input: { id },
    },
  ).pipe(
    tap({
      next(unit) {
        console.log('### UNIT deleted with id: ' + unit.deleteUnit?.id);
      },
    }),
    catchError(err => {
      console.error('Error during unit delete with id:' + id, err.message);
      return throwError(
        `Error during unit delete with id: ${id}, Err: ${err.message}`,
      );
    }),
  );
