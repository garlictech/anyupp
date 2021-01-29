import { IUnit } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Units Page] Init');

export const loadUnitsSuccess = createAction(
  '[Units] Load Units Success',
  props<{ units: IUnit[] }>()
);

export const loadUnitsFailure = createAction(
  '[Units] Load Units Failure',
  props<{ error: any }>()
);

export const resetUnits = createAction('[UnitList] Reset units');