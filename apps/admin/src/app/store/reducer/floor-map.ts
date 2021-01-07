import { Action, createReducer, on } from '@ngrx/store';

import { floorMapActions } from '../actions';
import { IFloorMapState } from '../state';

export const initialFloorMapState: IFloorMapState = {
  initialized: false,
};

const reducer = createReducer(
  initialFloorMapState,
  on(floorMapActions.resetFloorMap, (): any => ({
    ...initialFloorMapState,
  })),
  on(floorMapActions.floorMapInitialized, (state, { initialized }): any => ({
    ...state,
    initialized,
  }))
);

export function floorMapReducer(
  state: IFloorMapState | undefined,
  action: Action
): any {
  return reducer(state, action);
}
