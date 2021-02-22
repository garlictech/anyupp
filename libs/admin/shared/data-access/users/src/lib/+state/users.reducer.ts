import { IUser } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface IUsersState extends EntityState<IUser> {
  selectedId?: string | number; // which Users record has been selected
  loaded: boolean; // has the Users list been loaded
  error?: string | null; // last known error (if any)
}

export interface IUsersPartialState {
  readonly [USERS_FEATURE_KEY]: IUsersState;
}

export const usersAdapter: EntityAdapter<IUser> = createEntityAdapter<IUser>({
  selectId: (item: IUser): string => item._id,
});

export const initialState: IUsersState = usersAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialState,
  on(UsersActions.init, state => ({ ...state, loaded: false, error: null })),
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loaded: true })
  ),
  on(UsersActions.resetUsers, state => usersAdapter.removeAll(state))
);

export function usersReducer(state: IUsersState | undefined, action: Action) {
  return reducer(state, action);
}
