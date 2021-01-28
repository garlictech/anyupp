import { Action, createReducer, on } from '@ngrx/store';

import { currentUserActions } from '../actions';
import { ICurrentUserState } from '../state';

export const initialCurrentUserState: ICurrentUserState = {};

const reducer = createReducer(
  initialCurrentUserState,
  on(currentUserActions.resetCurrentAdminUser, () => ({
    ...initialCurrentUserState,
  })),
  on(currentUserActions.setCurrentAdminUser, (state, { adminUser }) => ({
    ...state,
    adminUser,
  }))
);

export function currentUserReducer(
  state: ICurrentUserState | undefined,
  action: Action
) {
  return reducer(state, action);
}
