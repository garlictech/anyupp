import {} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as appCoreActions from './app-core.actions';

export const APP_CORE_FEATURE_KEY = 'appCore';

export interface AppCoreState {
  loginContextFailure?: boolean;
  closableDialog: boolean;
}

export interface LoggedUserPartialState {
  readonly [APP_CORE_FEATURE_KEY]: AppCoreState;
}

export const initialAppCoreState: AppCoreState = {
  closableDialog: false,
};

const reducer = createReducer(
  initialAppCoreState,
  on(
    appCoreActions.setLoginContextFailure,
    (state, { loginContextFailure }) => ({ ...state, loginContextFailure }),
  ),
  on(appCoreActions.setClosableDialog, (state, { closableDialog }) => ({
    ...state,
    closableDialog,
  })),
);

export function appCoreReducer(
  state: AppCoreState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
