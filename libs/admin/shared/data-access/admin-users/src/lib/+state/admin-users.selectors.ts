import { IAdminUser } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ADMIN_USERS_FEATURE_KEY,
  IAdminUsersState,
  IAdminUsersPartialState,
  adminUsersAdapter,
} from './admin-users.reducer';

// Lookup the 'AdminUsers' feature state managed by NgRx
export const getAdminUsersState = createFeatureSelector<
  IAdminUsersPartialState,
  IAdminUsersState
>(ADMIN_USERS_FEATURE_KEY);

const { selectAll, selectEntities } = adminUsersAdapter.getSelectors();

export const getAdminUsersError = createSelector(
  getAdminUsersState,
  (state: IAdminUsersState) => state.error,
);

export const getAllAdminUsers = createSelector(
  getAdminUsersState,
  (state: IAdminUsersState) => selectAll(state),
);

export const getAdminUsersEntities = createSelector(
  getAdminUsersState,
  (state: IAdminUsersState) => selectEntities(state),
);

export const getAdminUserById = (id: string) => {
  return createSelector(getAllAdminUsers, (adminUsers: IAdminUser[]):
    | IAdminUser
    | undefined =>
    adminUsers.find((adminUser): boolean => adminUser.id === id),
  );
};

/*
export const getAdminUserByEmail = (email: string) => {
  return createSelector(getAllAdminUsers, (adminUsers: IAdminUser[]):
    | IAdminUser
    | undefined =>
    adminUsers.find((adminUser): boolean => adminUser.email === email),
  );
};
*/
