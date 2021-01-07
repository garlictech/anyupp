import { IAdminUser } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetCurrentAdminUser = createAction(
  '[Current admin user] Reset current admin user'
);
export const setCurrentAdminUser = createAction(
  '[Current admin user] Set current admin user',
  props<{ adminUser: IAdminUser }>()
);
