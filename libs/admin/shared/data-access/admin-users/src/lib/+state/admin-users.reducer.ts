import {} from '@bgap/shared/types';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import * as AdminUsersActions from './admin-users.actions';

export const ADMIN_USERS_FEATURE_KEY = 'adminUsers';

export interface AdminUsersState extends EntityState<CrudApi.AdminUser> {
  error?: string | null; // last known error (if any)
}

export interface AdminUsersPartialState {
  readonly [ADMIN_USERS_FEATURE_KEY]: AdminUsersState;
}

export const adminUsersAdapter = createEntityAdapter<CrudApi.AdminUser>();

export const initialAdminUserState = adminUsersAdapter.getInitialState({});

const reducer = createReducer(
  initialAdminUserState,
  on(AdminUsersActions.init, state => ({
    ...state,
    error: null,
  })),
  on(AdminUsersActions.upsertAdminUsers, (state, { adminUsers }) =>
    adminUsersAdapter.upsertMany(adminUsers, state),
  ),
  on(AdminUsersActions.resetAdminUsers, state =>
    adminUsersAdapter.removeAll(state),
  ),
);

export function adminUsersReducer(
  state: AdminUsersState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
