import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FLOOR_MAP_FEATURE_KEY, IFloorMapState } from './floor-map.reducer';

export const getFloorMapState = createFeatureSelector<IFloorMapState>(
  FLOOR_MAP_FEATURE_KEY,
);

export const getInitialized = createSelector(
  getFloorMapState,
  (state: IFloorMapState): boolean => state.initialized,
);
