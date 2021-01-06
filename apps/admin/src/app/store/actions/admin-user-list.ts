import { IAdminUser } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetAdminUsers = createAction('[AdminUserList] Reset admin users');
export const setAllAdminUsers = createAction(
  '[AdminUserList] Set all admin users',
  props<{ adminUsers: IAdminUser[] }>()
);
