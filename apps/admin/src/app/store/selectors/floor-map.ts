import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IFloorMapState } from '../state';

const featureSelector = createFeatureSelector<IFloorMapState>('floorMap');

export const getInitialized = createSelector(featureSelector, (state: IFloorMapState): boolean => state.initialized);
