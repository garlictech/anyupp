import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UnitsActions from './units.actions';

export const UNITS_FEATURE_KEY = 'units';

export interface UnitsState extends EntityState<CrudApi.Unit> {
  error?: string | null; // last known error (if any)
}

export const unitsAdapter: EntityAdapter<CrudApi.Unit> =
  createEntityAdapter<CrudApi.Unit>();

export const initialUnitsState: UnitsState = unitsAdapter.getInitialState({});

const reducer = createReducer(
  initialUnitsState,
  on(UnitsActions.init, state => ({ ...state, error: null })),
  on(UnitsActions.upsertUnits, (state, { units }) =>
    unitsAdapter.upsertMany(units, state),
  ),
  on(UnitsActions.resetUnits, state => unitsAdapter.removeAll(state)),
);

export function unitsReducer(state: UnitsState | undefined, action: Action) {
  return reducer(state, action);
}
