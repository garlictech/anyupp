import { IUser } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetUsers = createAction('[UserList] Reset users');
export const setAllUsers = createAction(
  '[UserList] Set all users',
  props<{ users: IUser[] }>()
);
