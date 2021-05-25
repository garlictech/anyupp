import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[AdminUsers] Init');

export const upsertAdminUsers = createAction(
  '[AdminUsers] Upsert admin users',
  props<{ adminUsers: CrudApi.AdminUser[] }>(),
);

export const resetAdminUsers = createAction('[AdminUsers] Reset admin users');
