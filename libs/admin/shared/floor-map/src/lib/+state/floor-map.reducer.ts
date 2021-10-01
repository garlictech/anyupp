import { Action, createReducer, on } from '@ngrx/store';

import * as FloorMapActions from './floor-map.actions';

export const FLOOR_MAP_FEATURE_KEY = 'floorMap';

export interface IFloorMapState {
  initialized: boolean;
}

export interface IFloorMapPartialState {
  readonly [FLOOR_MAP_FEATURE_KEY]: IFloorMapState;
}

export const initialFloorMapState: IFloorMapState = {
  initialized: false,
};

const reducer = createReducer(
  initialFloorMapState,
  on(FloorMapActions.resetFloorMap, () => ({
    ...initialFloorMapState,
  })),
  on(FloorMapActions.floorMapInitialized, (state, { initialized }) => ({
    ...state,
    initialized,
  })),
);

export function floorMapReducer(
  state: IFloorMapState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
