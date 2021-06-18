import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import {
  GROUPS_FEATURE_KEY,
  groupsAdapter,
  GroupsState,
} from './groups.reducer';

export const getGroupsState =
  createFeatureSelector<GroupsState>(GROUPS_FEATURE_KEY);

const { selectAll, selectEntities } = groupsAdapter.getSelectors();

export const getGroupsError = createSelector(
  getGroupsState,
  (state: GroupsState) => state.error,
);

export const getAllGroups = createSelector(
  getGroupsState,
  (state: GroupsState) => selectAll(state),
);

export const getGroupsEntities = createSelector(
  getGroupsState,
  (state: GroupsState) => selectEntities(state),
);

export const getGroupById = (id: string) => {
  return createSelector(
    getAllGroups,
    (groups: CrudApi.Group[]): CrudApi.Group | undefined =>
      groups.find((group): boolean => group.id === id),
  );
};

export const getSelectedChainGroups = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (
    userSettings: CrudApi.AdminUserSettings | undefined | null,
    groups: CrudApi.Group[],
  ): CrudApi.Group[] =>
    groups.filter(
      (group): boolean => group.chainId === userSettings?.selectedChainId,
    ),
);

export const getGroupsByChainId = (chainId: string) => {
  return createSelector(
    getAllGroups,
    (groups: CrudApi.Group[]): CrudApi.Group[] =>
      groups.filter((group): boolean => group.chainId === chainId),
  );
};

export const getSeletedGroup = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllGroups,
  (
    userSettings: CrudApi.AdminUserSettings | undefined | null,
    groups: CrudApi.Group[],
  ): CrudApi.Group | undefined =>
    groups.find((group): boolean => group.id === userSettings?.selectedGroupId),
);
