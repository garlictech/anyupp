import { Action, createReducer, on } from '@ngrx/store';

import { floorMapActions } from '../actions';
import { IFloorMapState } from '../state';

export const initialFloorMapState: IFloorMapState = {
  initialized: false,
};

const reducer = createReducer(
  initialFloorMapState,
  on(floorMapActions.resetFloorMap, () => ({
    ...initialFloorMapState,
  })),
  on(floorMapActions.floorMapInitialized, (state, { initialized }) => ({
    ...state,
    initialized,
  }))
);

export function floorMapReducer(
  state: IFloorMapState | undefined,
  action: Action
) {
  return reducer(state, action);
}
