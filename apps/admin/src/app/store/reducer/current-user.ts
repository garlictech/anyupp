import { Action, createReducer, on } from '@ngrx/store';

import { currentUserActions } from '../actions';
import { ICurrentUserState } from '../state';

export const initialCurrentUserState: ICurrentUserState = {};

const reducer = createReducer(
  initialCurrentUserState,
  on(currentUserActions.resetCurrentAdminUser, (): any => ({
    ...initialCurrentUserState,
  })),
  on(currentUserActions.setCurrentAdminUser, (state, { adminUser }): any => ({
    ...state,
    adminUser,
  }))
);

export function currentUserReducer(state: ICurrentUserState | undefined, action: Action): any {
  return reducer(state, action);
}
