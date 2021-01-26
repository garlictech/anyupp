import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FLOOR_MAP_FEATURE_KEY, FloorMapPartialState, State } from './floor-map.reducer';

export const getFloorMapState = createFeatureSelector<
  FloorMapPartialState,
  State
>(FLOOR_MAP_FEATURE_KEY);

export const getInitialized = createSelector(
  getFloorMapState,
  (state: State): boolean => state.initialized
);
