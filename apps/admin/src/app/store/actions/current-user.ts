import { createAction, props } from '@ngrx/store';
import { IAdminUser } from '@bgap/shared/types';

export const resetCurrentAdminUser = createAction(
  '[Current admin user] Reset current admin user'
);
export const setCurrentAdminUser = createAction(
  '[Current admin user] Set current admin user',
  props<{ adminUser: IAdminUser }>()
);
