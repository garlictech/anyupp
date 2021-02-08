import { IAdminUser } from '@bgap/shared/types';
import { Action, createReducer, on } from '@ngrx/store';

import * as LoggedUserActions from './logged-user.actions';

export const LOGGED_USER_FEATURE_KEY = 'loggedUser';

export interface ILoggedUserState {
  loggedUser?: IAdminUser;
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
  }))
);

export function loggedUserReducer(
  state: ILoggedUserState | undefined,
  action: Action
) {
  return reducer(state, action);
}
