import { IUnit } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UnitsActions from './units.actions';

export const UNITS_FEATURE_KEY = 'units';

export interface IUnitsState extends EntityState<IUnit> {
  error?: string | null; // last known error (if any)
}

export interface IUnitsPartialState {
  readonly [UNITS_FEATURE_KEY]: IUnitsState;
}

export const unitsAdapter: EntityAdapter<IUnit> = createEntityAdapter<IUnit>();

export const initialState: IUnitsState = unitsAdapter.getInitialState({

});

const reducer = createReducer(
  initialState,
  on(UnitsActions.init, state => ({ ...state, error: null })),
  on(UnitsActions.upsertUnit, (state, { unit }) =>
    unitsAdapter.upsertOne(unit, state),
  ),
  on(UnitsActions.resetUnits, state => unitsAdapter.removeAll(state)),
);

export function unitsReducer(state: IUnitsState | undefined, action: Action) {
  return reducer(state, action);
}
