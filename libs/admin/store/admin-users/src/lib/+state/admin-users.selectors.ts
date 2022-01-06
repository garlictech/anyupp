import {} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ADMIN_USERS_FEATURE_KEY,
  adminUsersAdapter,
  AdminUsersState,
} from './admin-users.reducer';

export const getAdminUsersState = createFeatureSelector<AdminUsersState>(
  ADMIN_USERS_FEATURE_KEY,
);

const { selectAll, selectEntities } = adminUsersAdapter.getSelectors();

export const getAdminUsersError = createSelector(
  getAdminUsersState,
  state => state.error,
);

export const getAllAdminUsers = createSelector(getAdminUsersState, state =>
  selectAll(state),
);

export const getAdminUsersEntities = createSelector(getAdminUsersState, state =>
  selectEntities(state),
);

export const getAdminUserById = (id: string) => {
  return createSelector(getAllAdminUsers, adminUsers =>
    adminUsers.find(adminUser => adminUser.id === id),
  );
};

/*
export const getAdminUserByEmail = (email: string) => {
  return createSelector(getAllAdminUsers, (adminUsers: []):
    | 
    | undefined =>
    adminUsers.find((adminUser): boolean => adminUser.email === email),
  );
};
*/
