import { IAdminUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[AdminUsers Page] Init');

export const upsertAdminUser = createAction(
  '[AdminUsers] Upsert admin user',
  props<{ adminUser: IAdminUser }>(),
);

export const resetAdminUsers = createAction('[AdminUsers] Reset admin users');
