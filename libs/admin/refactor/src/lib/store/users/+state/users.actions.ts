import { User } from '@bgap/domain';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users] Init');

export const upsertUser = createAction(
  '[Users] Upsert User',
  props<{ user: User }>(),
);

export const resetUsers = createAction('[Users] Reset users');
