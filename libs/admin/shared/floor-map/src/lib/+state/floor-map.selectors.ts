import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FLOOR_MAP_FEATURE_KEY, FloorMapState } from './floor-map.reducer';

export const getFloorMapState = createFeatureSelector<FloorMapState>(
  FLOOR_MAP_FEATURE_KEY,
);

export const getInitialized = createSelector(
  getFloorMapState,
  (state: FloorMapState): boolean => state.initialized,
);
