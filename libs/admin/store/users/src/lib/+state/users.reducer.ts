import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState extends EntityState<CrudApi.User> {
  error?: string | null; // last known error (if any)
}

export const usersAdapter: EntityAdapter<CrudApi.User> =
  createEntityAdapter<CrudApi.User>();

export const initialUsersState: UsersState = usersAdapter.getInitialState({});

const reducer = createReducer(
  initialUsersState,
  on(UsersActions.init, state => ({ ...state, error: null })),
  on(UsersActions.upsertUser, (state, { user }) =>
    usersAdapter.upsertOne(user, state),
  ),
  on(UsersActions.resetUsers, state => usersAdapter.removeAll(state)),
);

export function usersReducer(state: UsersState | undefined, action: Action) {
  return reducer(state, action);
}
