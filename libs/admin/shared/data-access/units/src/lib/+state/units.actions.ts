import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Units] Init');

export const upsertUnits = createAction(
  '[Units] Upsert Units',
  props<{ units: CrudApi.Unit[] }>(),
);

export const resetUnits = createAction('[Units] Reset units');

export const createUnit = createAction(
  '[Units] Create unit',
  props<{ formValue: CrudApi.CreateUnitInput }>(),
);

export const updateUnit = createAction(
  '[Units] Update unit',
  props<{ formValue: CrudApi.UpdateUnitInput }>(),
);
