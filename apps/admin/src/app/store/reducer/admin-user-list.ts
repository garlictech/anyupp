import { IAdminUser } from '../../shared/interfaces';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { adminUserListActions } from '../actions';
import { IAdminUserListState } from '../state';

export const adminUserListAdapter: EntityAdapter<IAdminUser> = createEntityAdapter<
  IAdminUser
>({
  selectId: (item: IAdminUser): string => item._id,
});
export const adminUserListInitialState: EntityState<IAdminUser> = adminUserListAdapter.getInitialState();

const baseAdminUserListReducer = createReducer(
  adminUserListInitialState,
  on(
    adminUserListActions.setAllAdminUsers,
    (state, { adminUsers }): EntityState<IAdminUser> =>
      adminUserListAdapter.setAll(adminUsers, state)
  ),
  on(
    adminUserListActions.resetAdminUsers,
    (state): EntityState<IAdminUser> => adminUserListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IAdminUserListState> = {
  adminUsers: baseAdminUserListReducer,
};

const reducer: ActionReducer<IAdminUserListState> = combineReducers(reducerMap);

export function adminUserListReducer(
  state: IAdminUserListState | undefined,
  action: Action
): IAdminUserListState {
  return reducer(state, action);
}
