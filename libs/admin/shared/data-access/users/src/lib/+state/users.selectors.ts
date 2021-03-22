import { IUser } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IUsersState, USERS_FEATURE_KEY, usersAdapter } from './users.reducer';

// Lookup the 'Users' feature state managed by NgRx
export const getUsersState = createFeatureSelector<IUsersState>(
  USERS_FEATURE_KEY,
);

const { selectAll, selectEntities } = usersAdapter.getSelectors();

export const getUsersLoaded = createSelector(
  getUsersState,
  (state: IUsersState) => state.loaded,
);

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

export const getSelectedId = createSelector(
  getUsersState,
  (state: IUsersState) => state.selectedId,
);

export const getSelected = createSelector(
  getUsersEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId],
);

export const getUserById = (id: string) => {
  return createSelector(getAllUsers, (users: IUser[]): IUser | undefined =>
    users.find((user): boolean => user.id === id),
  );
};
