import { IUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users] Init');

export const upsertUser = createAction(
  '[Uers] Upsert User',
  props<{ user: IUser }>(),
);

export const resetUsers = createAction('[Users] Reset users');
