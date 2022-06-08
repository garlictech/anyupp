import { AdminUser, Role } from '@bgap/domain';
import { createAction, props } from '@ngrx/store';

export const loadLoggedUserSuccess = createAction(
  '[LoggedUser/API] Load LoggedUser Success',
  props<{ loggedUser: AdminUser }>(),
);

export const resetLoggedUser = createAction(
  '[LoggedUser/API] Reset LoggedUser',
);

export const setCurrentContextRole = createAction(
  '[LoggedUser/API] Set the current context',
  props<{ currentContextRole: Role }>(),
);

export const setLoggedUserRole = createAction(
  '[LoggedUser/API] Set the logged user role',
  props<{ role: Role }>(),
);
