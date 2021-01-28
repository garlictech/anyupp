import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as GroupsActions from './groups.actions';
import { GroupsEntity } from './groups.models';

export const GROUPS_FEATURE_KEY = 'groups';

export interface State extends EntityState<GroupsEntity> {
  selectedId?: string | number; // which Groups record has been selected
  loaded: boolean; // has the Groups list been loaded
  error?: string | null; // last known error (if any)
}

export interface GroupsPartialState {
  readonly [GROUPS_FEATURE_KEY]: State;
}

export const groupsAdapter: EntityAdapter<GroupsEntity> = createEntityAdapter<
  GroupsEntity
>();

export const initialState: State = groupsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const groupsReducer = createReducer(
  initialState,
  on(GroupsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(GroupsActions.loadGroupsSuccess, (state, { groups }) =>
    groupsAdapter.setAll(groups, { ...state, loaded: true })
  ),
  on(GroupsActions.loadGroupsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return groupsReducer(state, action);
}
