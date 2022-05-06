import * as CrudApi from '@bgap/crud-gql/api';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UsersState, USERS_FEATURE_KEY, usersAdapter } from './users.reducer';

export const getUsersState =
  createFeatureSelector<UsersState>(USERS_FEATURE_KEY);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const getUsersError = createSelector(
  getUsersState,
  (state: UsersState) => state.error,
);

export const getAllUsers = createSelector(getUsersState, (state: UsersState) =>
  selectAll(state),
);

export const getUsersEntities = createSelector(
  getUsersState,
  (state: UsersState) => selectEntities(state),
);

export const getUserById = (id: string) =>
  createSelector(
    getAllUsers,
    (users: CrudApi.User[]): CrudApi.User | undefined =>
      users.find((user): boolean => user.id === id),
  );
