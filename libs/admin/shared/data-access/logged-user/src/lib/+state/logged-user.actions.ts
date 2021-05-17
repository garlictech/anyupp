import { EAdminRole } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';
import * as CrudSdk from '@bgap/crud-gql/api';

export const loadLoggedUserSuccess = createAction(
  '[LoggedUser/API] Load LoggedUser Success',
  props<{ loggedUser: CrudSdk.AdminUser | { role: EAdminRole } }>(),
);

export const resetLoggedUser = createAction(
  '[LoggedUser/API] Reset LoggedUser',
);

export const setCurrentContextRole = createAction(
  '[LoggedUser/API] Set the current context',
  props<{ currentContextRole: EAdminRole }>(),
);
