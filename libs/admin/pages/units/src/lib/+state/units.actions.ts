import { createAction, props } from '@ngrx/store';
import { UnitsEntity } from './units.models';

export const init = createAction('[Units Page] Init');

export const loadUnitsSuccess = createAction(
  '[Units/API] Load Units Success',
  props<{ units: UnitsEntity[] }>()
);

export const loadUnitsFailure = createAction(
  '[Units/API] Load Units Failure',
  props<{ error: any }>()
);
