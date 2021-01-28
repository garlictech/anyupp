import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as UnitsActions from './units.actions';
import { UnitsEntity } from './units.models';

export const UNITS_FEATURE_KEY = 'units';

export interface State extends EntityState<UnitsEntity> {
  selectedId?: string | number; // which Units record has been selected
  loaded: boolean; // has the Units list been loaded
  error?: string | null; // last known error (if any)
}

export interface UnitsPartialState {
  readonly [UNITS_FEATURE_KEY]: State;
}

export const unitsAdapter: EntityAdapter<UnitsEntity> = createEntityAdapter<
  UnitsEntity
>();

export const initialState: State = unitsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const unitsReducer = createReducer(
  initialState,
  on(UnitsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(UnitsActions.loadUnitsSuccess, (state, { units }) =>
    unitsAdapter.setAll(units, { ...state, loaded: true })
  ),
  on(UnitsActions.loadUnitsFailure, (state, { error }) => ({ ...state, error }))
);

export function reducer(state: State | undefined, action: Action) {
  return unitsReducer(state, action);
}
