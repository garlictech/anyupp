import { IUnit } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetUnits = createAction('[UnitList] Reset units');
export const setAllUnits = createAction('[UnitList] Set all units', props<{ units: IUnit[] }>());
