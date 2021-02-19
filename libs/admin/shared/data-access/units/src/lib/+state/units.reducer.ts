import { IUnit } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UnitsActions from './units.actions';

export const UNITS_FEATURE_KEY = 'units';

export interface IUnitsState extends EntityState<IUnit> {
  selectedId?: string | number; // which Units record has been selected
  loaded: boolean; // has the Units list been loaded
  error?: string | null; // last known error (if any)
}

export interface IUnitsPartialState {
  readonly [UNITS_FEATURE_KEY]: IUnitsState;
}

export const unitsAdapter: EntityAdapter<IUnit> = createEntityAdapter<IUnit>({
  selectId: (item: IUnit): string => item._id,
});

export const initialState: IUnitsState = unitsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialState,
  on(UnitsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(UnitsActions.loadUnitsSuccess, (state, { units }) =>
    unitsAdapter.setAll(units, { ...state, loaded: true }),
  ),
  on(UnitsActions.resetUnits, state => unitsAdapter.removeAll(state)),
);

export function unitsReducer(state: IUnitsState | undefined, action: Action) {
  return reducer(state, action);
}
