/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { unitSeed } from '../fixtures/unit';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  crudBackendGraphQLClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestUnit = (input: Partial<CrudApi.CreateUnitInput>) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.CreateUnitMutation>(
    CrudApiMutationDocuments.createUnit,
    {
      input,
    },
  ).pipe(resultTap('UNIT create', input.id!));

export const deleteTestUnit = (id: string) =>
  executeMutation(crudBackendGraphQLClient)<CrudApi.DeleteUnitMutation>(
    CrudApiMutationDocuments.deleteUnit,
    { input: { id } },
  ).pipe(resultTap('UNIT delete', id));
