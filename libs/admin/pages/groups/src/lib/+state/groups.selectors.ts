import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  GROUPS_FEATURE_KEY,
  State,
  GroupsPartialState,
  groupsAdapter,
} from './groups.reducer';

// Lookup the 'Groups' feature state managed by NgRx
export const getGroupsState = createFeatureSelector<GroupsPartialState, State>(
  GROUPS_FEATURE_KEY
);

const { selectAll, selectEntities } = groupsAdapter.getSelectors();

export const getGroupsLoaded = createSelector(
  getGroupsState,
  (state: State) => state.loaded
);

export const getGroupsError = createSelector(
  getGroupsState,
  (state: State) => state.error
);

export const getAllGroups = createSelector(getGroupsState, (state: State) =>
  selectAll(state)
);

export const getGroupsEntities = createSelector(
  getGroupsState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getGroupsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getGroupsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
