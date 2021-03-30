import { IUser } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface IUsersState extends EntityState<IUser> {
  error?: string | null; // last known error (if any)
}

export interface IUsersPartialState {
  readonly [USERS_FEATURE_KEY]: IUsersState;
}

export const usersAdapter: EntityAdapter<IUser> = createEntityAdapter<IUser>();

export const initialState: IUsersState = usersAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(UsersActions.init, state => ({ ...state, error: null })),
  on(UsersActions.upsertUser, (state, { user }) =>
    usersAdapter.upsertOne(user, state),
  ),
  on(UsersActions.resetUsers, state => usersAdapter.removeAll(state)),
);

export function usersReducer(state: IUsersState | undefined, action: Action) {
  return reducer(state, action);
}
