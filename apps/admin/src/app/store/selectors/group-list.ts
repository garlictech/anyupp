import { get as _get } from 'lodash-es';
import { IAdminUserSettings, IGroup } from '@bgap/shared/types';

import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { groupListAdapter } from '../reducer';
import { IGroupEntityState, IGroupListState } from '../state';
import * as currentUserSelectors from './current-user';

const featureSelector = createFeatureSelector<IGroupListState>('groupList');

const groupListSelector = createSelector(
  featureSelector,
  (state: IGroupListState): IGroupEntityState => state.groups
);
export const getAllGroups = groupListAdapter.getSelectors(groupListSelector)
  .selectAll;
export const getAllGroupIds = groupListAdapter.getSelectors(groupListSelector)
  .selectIds;
export const getAllGroupCount = groupListAdapter.getSelectors(groupListSelector)
  .selectTotal;

export const getGroupById = (id: string) => {
  return createSelector(
    getAllGroups,
    (groups: IGroup[]): IGroup =>
      groups.find((group): boolean => group._id === id)
  );
};

export const getSelectedChainGroups = createSelector(
  currentUserSelectors.getAdminUserSettings,
  getAllGroups,
  (userSettings: IAdminUserSettings, groups: IGroup[]): IGroup[] =>
    groups.filter(
      (group): boolean =>
        group.chainId === _get(userSettings, 'selectedChainId')
    )
);

export const getGroupsByChainId = (
  chainId: string
) => {
  return createSelector(getAllGroups, (groups: IGroup[]): IGroup[] =>
    groups.filter((group): boolean => group.chainId === chainId)
  );
};

export const getSeletedGroup = createSelector(
  currentUserSelectors.getAdminUserSettings,
  getAllGroups,
  (userSettings: IAdminUserSettings, groups: IGroup[]): IGroup =>
    groups.find(
      (group): boolean => group._id === _get(userSettings, 'selectedGroupId')
    )
);
