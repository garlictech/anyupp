import { IUser } from '@bgap/shared/types/interfaces';

import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { userListAdapter } from '../reducer';
import { IUserEntityState, IUserListState } from '../state';

const featureSelector = createFeatureSelector<IUserListState>('userList');

const userListSelector = createSelector(
  featureSelector,
  (state: IUserListState): IUserEntityState => state.users
);
export const getAllUsers = userListAdapter.getSelectors(userListSelector)
  .selectAll;
export const getAllUserIds = userListAdapter.getSelectors(userListSelector)
  .selectIds;
export const getAllUserCount = userListAdapter.getSelectors(userListSelector)
  .selectTotal;

export const getUserById = (id: string) => {
  return createSelector(
    getAllUsers,
    (users: IUser[]): IUser => users.find((user): boolean => user._id === id)
  );
};
