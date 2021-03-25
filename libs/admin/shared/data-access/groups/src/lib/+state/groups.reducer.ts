import { IGroup } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as GroupsActions from './groups.actions';

export const GROUPS_FEATURE_KEY = 'groups';

export interface IGroupsState extends EntityState<IGroup> {
  error?: string | null; // last known error (if any)
}

export interface IGroupsPartialState {
  readonly [GROUPS_FEATURE_KEY]: IGroupsState;
}

export const groupsAdapter: EntityAdapter<IGroup> = createEntityAdapter<
  IGroup
>();

export const initialState: IGroupsState = groupsAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(GroupsActions.init, state => ({ ...state, error: null })),
  on(GroupsActions.upsertGroup, (state, { group }) =>
    groupsAdapter.upsertOne(group, state),
  ),
  on(GroupsActions.resetGroups, state => groupsAdapter.removeAll(state)),
);

export function groupsReducer(state: IGroupsState | undefined, action: Action) {
  return reducer(state, action);
}
