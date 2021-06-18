import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import * as GroupsActions from './groups.actions';

export const GROUPS_FEATURE_KEY = 'groups';

export interface GroupsState extends EntityState<CrudApi.Group> {
  error?: string | null; // last known error (if any)
}

export interface GroupsPartialState {
  readonly [GROUPS_FEATURE_KEY]: GroupsState;
}

export const groupsAdapter: EntityAdapter<CrudApi.Group> =
  createEntityAdapter<CrudApi.Group>();

export const initialState: GroupsState = groupsAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(GroupsActions.init, state => ({ ...state, error: null })),
  on(GroupsActions.upsertGroups, (state, { groups }) =>
    groupsAdapter.upsertMany(groups, state),
  ),
  on(GroupsActions.resetGroups, state => groupsAdapter.removeAll(state)),
);

export function groupsReducer(state: GroupsState | undefined, action: Action) {
  return reducer(state, action);
}
