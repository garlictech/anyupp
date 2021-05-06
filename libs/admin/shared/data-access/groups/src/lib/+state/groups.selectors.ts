import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IAdminUserSettings, IGroup } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  GROUPS_FEATURE_KEY,
  groupsAdapter,
  IGroupsState,
} from './groups.reducer';

export const getGroupsState = createFeatureSelector<IGroupsState>(
  GROUPS_FEATURE_KEY,
);

const { selectAll, selectEntities } = groupsAdapter.getSelectors();

export const getGroupsError = createSelector(
  getGroupsState,
  (state: IGroupsState) => state.error,
);

export const getAllGroups = createSelector(
  getGroupsState,
  (state: IGroupsState) => selectAll(state),
);

export const getGroupsEntities = createSelector(
  getGroupsState,
  (state: IGroupsState) => selectEntities(state),
);

export const getGroupById = (id: string) => {
  return createSelector(getAllGroups, (groups: IGroup[]): IGroup | undefined =>
    groups.find((group): boolean => group.id === id),
  );
};

export const getSelectedChainGroups = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (userSettings: IAdminUserSettings | undefined, groups: IGroup[]): IGroup[] =>
    groups.filter(
      (group): boolean => group.chainId === userSettings?.selectedChainId,
    ),
);

export const getGroupsByChainId = (chainId: string) => {
  return createSelector(getAllGroups, (groups: IGroup[]): IGroup[] =>
    groups.filter((group): boolean => group.chainId === chainId),
  );
};

export const getSeletedGroup = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (
    userSettings: IAdminUserSettings | undefined,
    groups: IGroup[],
  ): IGroup | undefined =>
    groups.find((group): boolean => group.id === userSettings?.selectedGroupId),
);
