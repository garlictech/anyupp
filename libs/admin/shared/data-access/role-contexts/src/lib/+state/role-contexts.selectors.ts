import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  ROLE_CONTEXTS_FEATURE_KEY,
  IRoleContextsState,
  roleContextsAdapter,
} from './role-contexts.reducer';

export const getRoleContextsState = createFeatureSelector<IRoleContextsState>(
  ROLE_CONTEXTS_FEATURE_KEY,
);

const { selectAll, selectEntities } = roleContextsAdapter.getSelectors();

export const getRoleContextsError = createSelector(
  getRoleContextsState,
  (state: IRoleContextsState) => state.error,
);

export const getAllRoleContexts = createSelector(
  getRoleContextsState,
  (state: IRoleContextsState) => selectAll(state),
);

export const getRoleContextsEntities = createSelector(
  getRoleContextsState,
  (state: IRoleContextsState) => selectEntities(state),
);
