import { IGroup } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as GroupsActions from './groups.actions';

export const GROUPS_FEATURE_KEY = 'groups';

export interface IGroupsState extends EntityState<IGroup> {
  selectedId?: string | number; // which Groups record has been selected
  loaded: boolean; // has the Groups list been loaded
  error?: string | null; // last known error (if any)
}

export interface IGroupsPartialState {
  readonly [GROUPS_FEATURE_KEY]: IGroupsState;
}

export const groupsAdapter: EntityAdapter<IGroup> = createEntityAdapter<IGroup>(
  {
    selectId: (item: IGroup): string => item._id,
  },
);

export const initialState: IGroupsState = groupsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialState,
  on(GroupsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(GroupsActions.loadGroupsSuccess, (state, { groups }) =>
    groupsAdapter.setAll(groups, { ...state, loaded: true }),
  ),
  on(GroupsActions.resetGroups, state => groupsAdapter.removeAll(state)),
);

export function groupsReducer(state: IGroupsState | undefined, action: Action) {
  return reducer(state, action);
}
