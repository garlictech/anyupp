import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Users] Init');

export const upsertUser = createAction(
  '[Users] Upsert User',
  props<{ user: CrudApi.User }>(),
);

export const resetUsers = createAction('[Users] Reset users');
