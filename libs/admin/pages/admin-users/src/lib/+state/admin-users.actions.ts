import { IAdminUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[AdminUsers Page] Init');

export const loadAdminUsersSuccess = createAction(
  '[AdminUsers/API] Load AdminUsers Success',
  props<{ adminUsers: IAdminUser[] }>()
);

export const loadAdminUsersFailure = createAction(
  '[AdminUsers/API] Load AdminUsers Failure',
  props<{ error: any }>()
);

export const resetAdminUsers = createAction(
  '[AdminUsers/API] Reset admin users'
);