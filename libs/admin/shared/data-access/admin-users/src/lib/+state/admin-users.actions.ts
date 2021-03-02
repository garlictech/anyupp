import { IAdminUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[AdminUsers Page] Init');

export const loadAdminUsersSuccess = createAction(
  '[AdminUsers] Load AdminUsers Success',
  props<{ adminUsers: IAdminUser[] }>(),
);

export const upsertAdminUser = createAction(
  '[AdminUsers] Upsert AdminUser',
  props<{ adminUser: IAdminUser }>(),
);

export const resetAdminUsers = createAction('[AdminUsers] Reset admin users');
