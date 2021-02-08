import { IUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users Page] Init');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: IUser[] }>()
);

export const resetUsers = createAction('[UserList] Reset users');
