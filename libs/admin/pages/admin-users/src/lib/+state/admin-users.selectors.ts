import { IAdminUser } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ADMIN_USERS_FEATURE_KEY,
  State,
  AdminUsersPartialState,
  adminUsersAdapter,
} from './admin-users.reducer';

// Lookup the 'AdminUsers' feature state managed by NgRx
export const getAdminUsersState = createFeatureSelector<
  AdminUsersPartialState,
  State
>(ADMIN_USERS_FEATURE_KEY);

const { selectAll, selectEntities } = adminUsersAdapter.getSelectors();

export const getAdminUsersLoaded = createSelector(
  getAdminUsersState,
  (state: State) => state.loaded
);

export const getAdminUsersError = createSelector(
  getAdminUsersState,
  (state: State) => state.error
);

export const getAllAdminUsers = createSelector(
  getAdminUsersState,
  (state: State) => selectAll(state)
);

export const getAdminUsersEntities = createSelector(
  getAdminUsersState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getAdminUsersState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getAdminUsersEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getAdminUserById = (id: string) => {
  return createSelector(
    getAllAdminUsers,
    (adminUsers: IAdminUser[]): IAdminUser =>
      adminUsers.find((adminUser): boolean => adminUser._id === id)
  );
};

export const getAdminUserByEmail = (email: string) => {
  return createSelector(
    getAllAdminUsers,
    (adminUsers: IAdminUser[]): IAdminUser =>
      adminUsers.find((adminUser): boolean => adminUser.email === email)
  );
};
