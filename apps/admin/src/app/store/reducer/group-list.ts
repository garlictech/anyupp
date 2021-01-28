import { IGroup } from '@bgap/shared/types';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { groupListActions } from '../actions';
import { IGroupListState } from '../state';

export const groupListAdapter: EntityAdapter<IGroup> = createEntityAdapter<
  IGroup
>({
  selectId: (item: IGroup): string => item._id,
});
export const groupListInitialState: EntityState<IGroup> = groupListAdapter.getInitialState();

const baseGroupListReducer = createReducer(
  groupListInitialState,
  on(
    groupListActions.setAllGroups,
    (state, { groups }): EntityState<IGroup> =>
      groupListAdapter.setAll(groups, state)
  ),
  on(
    groupListActions.resetGroups,
    (state): EntityState<IGroup> => groupListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IGroupListState> = {
  groups: baseGroupListReducer,
};

const reducer: ActionReducer<IGroupListState> = combineReducers(reducerMap);

export function groupListReducer(
  state: IGroupListState | undefined,
  action: Action
): IGroupListState {
  return reducer(state, action);
}
