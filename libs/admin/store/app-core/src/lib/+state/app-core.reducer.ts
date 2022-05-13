import {} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as appCoreActions from './app-core.actions';

export const APP_CORE_FEATURE_KEY = 'appCore';

// TEMP SECURITY
export interface TempChainRestrictionObject {
  [userId: string]: string[];
}

export interface AppCoreState {
  loginContextFailure?: boolean;
  closableDialog: boolean;
  playNewOrderNotification: boolean;
  // TEMP SECURITY
  chainRestrictions: TempChainRestrictionObject;
}

export const initialAppCoreState: AppCoreState = {
  closableDialog: false,
  playNewOrderNotification: false,
  chainRestrictions: {},
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
  on(
    appCoreActions.setPlayNewOrderNotification,
    (state, { playNewOrderNotification }) => ({
      ...state,
      playNewOrderNotification,
    }),
  ),
  // TEMP SECURITY
  on(
    appCoreActions.setChainRestrictionObject,
    (state, { chainRestrictions }) => ({
      ...state,
      chainRestrictions,
    }),
  ),
);

export function appCoreReducer(
  state: AppCoreState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
