import {} from '@bgap/shared/types';
import { Action, createReducer } from '@ngrx/store';

export const APP_CORE_FEATURE_KEY = 'appCore';

export interface IAppCoreState {
  error?: string | null; // last known error (if any)
}

export interface LoggedUserPartialState {
  readonly [APP_CORE_FEATURE_KEY]: IAppCoreState;
}

export const initialState: IAppCoreState = {};

const reducer = createReducer(initialState);

export function appCoreReducer(
  state: IAppCoreState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
