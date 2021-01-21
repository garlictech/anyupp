import { createAction, props } from '@ngrx/store';
import { IUnit } from '@bgap/shared/types/interfaces';

export const resetUnits = createAction('[UnitList] Reset units');
export const setAllUnits = createAction(
  '[UnitList] Set all units',
  props<{ units: IUnit[] }>()
);
