import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Units] Init');

export const upsertUnits = createAction(
  '[Units] Upsert Units',
  props<{ units: CrudApi.Unit[] }>(),
);

export const resetUnits = createAction('[Units] Reset units');
