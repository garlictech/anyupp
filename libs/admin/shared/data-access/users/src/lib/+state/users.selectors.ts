import { IUser } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IUsersState, USERS_FEATURE_KEY, usersAdapter } from './users.reducer';

export const getUsersState = createFeatureSelector<IUsersState>(
  USERS_FEATURE_KEY,
);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const getUsersError = createSelector(
  getUsersState,
  (state: IUsersState) => state.error,
);

export const getAllUsers = createSelector(getUsersState, (state: IUsersState) =>
  selectAll(state),
);

export const getUsersEntities = createSelector(
  getUsersState,
  (state: IUsersState) => selectEntities(state),
);

export const getUserById = (id: string) => {
  return createSelector(getAllUsers, (users: IUser[]): IUser | undefined =>
    users.find((user): boolean => user.id === id),
  );
};
