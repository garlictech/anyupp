import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ROLE_CONTEXTS_FEATURE_KEY,
  RoleContextsState,
  roleContextsAdapter,
} from './role-contexts.reducer';

export const getRoleContextsState = createFeatureSelector<RoleContextsState>(
  ROLE_CONTEXTS_FEATURE_KEY,
);

const { selectAll, selectEntities } = roleContextsAdapter.getSelectors();

export const getRoleContextsError = createSelector(
  getRoleContextsState,
  (state: RoleContextsState) => state.error,
);

export const getAllRoleContexts = createSelector(
  getRoleContextsState,
  (state: RoleContextsState) => selectAll(state),
);

export const getRoleContextsEntities = createSelector(
  getRoleContextsState,
  (state: RoleContextsState) => selectEntities(state),
);
