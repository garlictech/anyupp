import {} from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import * as LoggedUserActions from './logged-user.actions';

export const LOGGED_USER_FEATURE_KEY = 'loggedUser';

export interface ILoggedUserState {
  loggedUser?: CrudApi.AdminUser;
  currentContextRole?: CrudApi.Role;
  role?: CrudApi.Role; // Filled from token
}

export interface LoggedUserPartialState {
  readonly [LOGGED_USER_FEATURE_KEY]: ILoggedUserState;
}

export const initialState: ILoggedUserState = {};

const reducer = createReducer(
  initialState,
  on(LoggedUserActions.resetLoggedUser, () => ({
    ...initialState,
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
  state: ILoggedUserState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
