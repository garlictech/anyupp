import { createAction, props } from '@ngrx/store';
import { IUser } from '@bgap/shared/types';

export const resetUsers = createAction('[UserList] Reset users');
export const setAllUsers = createAction(
  '[UserList] Set all users',
  props<{ users: IUser[] }>()
);
