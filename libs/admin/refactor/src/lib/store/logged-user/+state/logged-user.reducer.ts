import { AdminUser, Role } from '@bgap/domain';
import {} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as LoggedUserActions from './logged-user.actions';

export const LOGGED_USER_FEATURE_KEY = 'loggedUser';

export interface LoggedUserState {
  loggedUser?: AdminUser;
  currentContextRole?: Role;
  role?: Role; // Filled from token
}

export const initialLoggedUserState: LoggedUserState = {};

const reducer = createReducer(
  initialLoggedUserState,
  on(LoggedUserActions.resetLoggedUser, () => ({
    ...initialLoggedUserState,
  })),
  on(LoggedUserActions.loadLoggedUserSuccess, (state, { loggedUser }) => ({
    ...state,
    loggedUser,
  })),
  on(
    LoggedUserActions.setCurrentContextRole,
    (state, { currentContextRole }) => ({
      ...state,
      currentContextRole,
    }),
  ),
  on(LoggedUserActions.setLoggedUserRole, (state, { role }) => ({
    ...state,
    role,
  })),
);

export function loggedUserReducer(
  state: LoggedUserState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
