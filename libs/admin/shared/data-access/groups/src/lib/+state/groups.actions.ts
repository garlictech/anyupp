import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[Groups] Init');

export const upsertGroups = createAction(
  '[Groups] Upsert groups',
  props<{ groups: CrudApi.Group[] }>(),
);

export const resetGroups = createAction('[Groups] Reset groups');
