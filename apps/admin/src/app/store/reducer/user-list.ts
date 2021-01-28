import { IUser } from '@bgap/shared/types';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { userListActions } from '../actions';
import { IUserListState } from '../state';

export const userListAdapter: EntityAdapter<IUser> = createEntityAdapter<IUser>(
  {
    selectId: (item: IUser): string => item._id,
  }
);
export const userListInitialState: EntityState<IUser> = userListAdapter.getInitialState();

const baseUserListReducer = createReducer(
  userListInitialState,
  on(
    userListActions.setAllUsers,
    (state, { users }): EntityState<IUser> =>
      userListAdapter.setAll(users, state)
  ),
  on(
    userListActions.resetUsers,
    (state): EntityState<IUser> => userListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IUserListState> = {
  users: baseUserListReducer,
};

const reducer: ActionReducer<IUserListState> = combineReducers(reducerMap);

export function userListReducer(state: IUserListState | undefined, action: Action): IUserListState {
  return reducer(state, action);
}
