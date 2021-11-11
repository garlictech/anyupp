import {} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as appCoreActions from './app-core.actions';

export const APP_CORE_FEATURE_KEY = 'appCore';

export interface IAppCoreState {
  loginContextFailure?: boolean;
  closableDialog: boolean;
}

export interface LoggedUserPartialState {
  readonly [APP_CORE_FEATURE_KEY]: IAppCoreState;
}

export const initialAppCoreState: IAppCoreState = {
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
  state: IAppCoreState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
