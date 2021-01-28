import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  UNITS_FEATURE_KEY,
  State,
  UnitsPartialState,
  unitsAdapter,
} from './units.reducer';

// Lookup the 'Units' feature state managed by NgRx
export const getUnitsState = createFeatureSelector<UnitsPartialState, State>(
  UNITS_FEATURE_KEY
);

const { selectAll, selectEntities } = unitsAdapter.getSelectors();

export const getUnitsLoaded = createSelector(
  getUnitsState,
  (state: State) => state.loaded
);

export const getUnitsError = createSelector(
  getUnitsState,
  (state: State) => state.error
);

export const getAllUnits = createSelector(getUnitsState, (state: State) =>
  selectAll(state)
);

export const getUnitsEntities = createSelector(getUnitsState, (state: State) =>
  selectEntities(state)
);

export const getSelectedId = createSelector(
  getUnitsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getUnitsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
