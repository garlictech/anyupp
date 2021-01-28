import { IAdminUser } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as AdminUsersActions from './admin-users.actions';

export const ADMIN_USERS_FEATURE_KEY = 'adminUsers';

export interface State extends EntityState<IAdminUser> {
  selectedId?: string | number; // which AdminUsers record has been selected
  loaded: boolean; // has the AdminUsers list been loaded
  error?: string | null; // last known error (if any)
}

export interface AdminUsersPartialState {
  readonly [ADMIN_USERS_FEATURE_KEY]: State;
}

export const adminUsersAdapter: EntityAdapter<IAdminUser> = createEntityAdapter<IAdminUser>();

export const initialState: State = adminUsersAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const adminUsersReducer = createReducer(
  initialState,
  on(AdminUsersActions.init, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AdminUsersActions.loadAdminUsersSuccess, (state, { adminUsers }) =>
    adminUsersAdapter.setAll(adminUsers, { ...state, loaded: true })
  ),
  on(AdminUsersActions.loadAdminUsersFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(
    AdminUsersActions.resetAdminUsers,
    (state): EntityState<IAdminUser> => adminUsersAdapter.removeAll(state)
  )
);

export function reducer(state: State | undefined, action: Action) {
  return adminUsersReducer(state, action);
}
