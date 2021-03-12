import { IUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users Page] Init');

export const upsertUser = createAction(
  '[Uers] Upsert User',
  props<{ user: IUser }>(),
);


export const resetUsers = createAction('[UserList] Reset users');
