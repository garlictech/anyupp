import { createAction, props } from '@ngrx/store';
import { IAdminUser } from '@bgap/shared/types';

export const resetAdminUsers = createAction(
  '[AdminUserList] Reset admin users'
);
export const setAllAdminUsers = createAction(
  '[AdminUserList] Set all admin users',
  props<{ adminUsers: IAdminUser[] }>()
);
