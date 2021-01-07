import { IAdminUser } from '../../shared/interfaces';

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { adminUserListAdapter } from '../reducer';
import { IAdminUserEntityState, IAdminUserListState } from '../state';

const featureSelector = createFeatureSelector<IAdminUserListState>(
  'adminUserList'
);

const adminUserListSelector: MemoizedSelector<
  object,
  IAdminUserEntityState
> = createSelector(
  featureSelector,
  (state: IAdminUserListState): IAdminUserEntityState => state.adminUsers
);
export const getAllAdminUsers = adminUserListAdapter.getSelectors(
  adminUserListSelector
).selectAll;
export const getAllAdminUserIds = adminUserListAdapter.getSelectors(
  adminUserListSelector
).selectIds;
export const getAllAdminUserCount = adminUserListAdapter.getSelectors(
  adminUserListSelector
).selectTotal;

export const getAdminUserById = (
  id: string
): MemoizedSelector<object, IAdminUser> => {
  return createSelector(
    getAllAdminUsers,
    (adminUsers: IAdminUser[]): IAdminUser =>
      adminUsers.find((adminUser): boolean => adminUser._id === id)
  );
};

export const getAdminUserByEmail = (
  email: string
): MemoizedSelector<object, IAdminUser> => {
  return createSelector(
    getAllAdminUsers,
    (adminUsers: IAdminUser[]): IAdminUser =>
      adminUsers.find((adminUser): boolean => adminUser.email === email)
  );
};
