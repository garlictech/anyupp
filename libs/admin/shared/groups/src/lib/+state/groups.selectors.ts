import { get as _get } from 'lodash-es';

import { loggedUserSelectors } from '@bgap/admin/shared/logged-user';
import { IAdminUserSettings, IGroup } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  GROUPS_FEATURE_KEY,
  groupsAdapter,
  IGroupsState,
} from './groups.reducer';

// Lookup the 'Groups' feature state managed by NgRx
export const getGroupsState = createFeatureSelector<IGroupsState>(
  GROUPS_FEATURE_KEY
);

const { selectAll, selectEntities } = groupsAdapter.getSelectors();

export const getGroupsLoaded = createSelector(
  getGroupsState,
  (state: IGroupsState) => state.loaded
);

export const getGroupsError = createSelector(
  getGroupsState,
  (state: IGroupsState) => state.error
);

export const getAllGroups = createSelector(
  getGroupsState,
  (state: IGroupsState) => selectAll(state)
);

export const getGroupsEntities = createSelector(
  getGroupsState,
  (state: IGroupsState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getGroupsState,
  (state: IGroupsState) => state.selectedId
);

export const getSelected = createSelector(
  getGroupsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getGroupById = (id: string) => {
  return createSelector(
    getAllGroups,
    (groups: IGroup[]): IGroup =>
      groups.find((group): boolean => group._id === id)
  );
};

export const getSelectedChainGroups = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (userSettings: IAdminUserSettings, groups: IGroup[]): IGroup[] =>
    groups.filter(
      (group): boolean =>
        group.chainId === _get(userSettings, 'selectedChainId')
    )
);

export const getGroupsByChainId = (chainId: string) => {
  return createSelector(getAllGroups, (groups: IGroup[]): IGroup[] =>
    groups.filter((group): boolean => group.chainId === chainId)
  );
};

export const getSeletedGroup = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (userSettings: IAdminUserSettings, groups: IGroup[]): IGroup =>
    groups.find(
      (group): boolean => group._id === _get(userSettings, 'selectedGroupId')
    )
);
