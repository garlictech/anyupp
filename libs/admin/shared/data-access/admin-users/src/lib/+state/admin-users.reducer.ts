import { IAdminUser } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as AdminUsersActions from './admin-users.actions';

export const ADMIN_USERS_FEATURE_KEY = 'adminUsers';

export interface IAdminUsersState extends EntityState<IAdminUser> {
  selectedId?: string | number; // which AdminUsers record has been selected
  loaded: boolean; // has the AdminUsers list been loaded
  error?: string | null; // last known error (if any)
}

export interface IAdminUsersPartialState {
  readonly [ADMIN_USERS_FEATURE_KEY]: IAdminUsersState;
}

export const adminUsersAdapter: EntityAdapter<IAdminUser> = createEntityAdapter<IAdminUser>();

export const initialState: IAdminUsersState = adminUsersAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  },
);

const reducer = createReducer(
  initialState,
  on(AdminUsersActions.init, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(AdminUsersActions.upsertAdminUser, (state, { adminUser }) =>
  adminUsersAdapter.upsertOne(adminUser, state),
  ),
  /*
  on(AdminUsersActions.loadAdminUsersSuccess, (state, { adminUsers }) =>
    adminUsersAdapter.setAll(adminUsers, { ...state, loaded: true }),
  ),
  */
  on(AdminUsersActions.resetAdminUsers, state =>
    adminUsersAdapter.removeAll(state),
  ),
);

export function adminUsersReducer(
  state: IAdminUsersState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
