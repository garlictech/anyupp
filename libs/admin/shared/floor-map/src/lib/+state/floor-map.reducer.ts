import { Action, createReducer, on } from '@ngrx/store';

import * as FloorMapActions from './floor-map.actions';

export const FLOOR_MAP_FEATURE_KEY = 'floorMap';

export interface State {
  initialized: boolean;
}

export interface FloorMapPartialState {
  readonly [FLOOR_MAP_FEATURE_KEY]: State;
}

export const initialState: State = {
  initialized: false,
};

const floorMapReducer = createReducer(
  initialState,
  on(FloorMapActions.resetFloorMap, () => ({
    ...initialState,
  })),
  on(FloorMapActions.floorMapInitialized, (state, { initialized }) => ({
    ...state,
    initialized,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return floorMapReducer(state, action);
}
