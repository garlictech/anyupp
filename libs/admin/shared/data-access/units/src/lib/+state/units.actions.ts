import { IUnit } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Units] Init');

export const upsertUnit = createAction(
  '[Units] Upsert Unit',
  props<{ unit: IUnit }>(),
);

export const resetUnits = createAction('[Units] Reset units');
