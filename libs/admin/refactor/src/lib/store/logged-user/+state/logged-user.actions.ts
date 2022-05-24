import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const loadLoggedUserSuccess = createAction(
  '[LoggedUser/API] Load LoggedUser Success',
  props<{ loggedUser: CrudApi.AdminUser }>(),
);

export const resetLoggedUser = createAction(
  '[LoggedUser/API] Reset LoggedUser',
);

export const setCurrentContextRole = createAction(
  '[LoggedUser/API] Set the current context',
  props<{ currentContextRole: CrudApi.Role }>(),
);

export const setLoggedUserRole = createAction(
  '[LoggedUser/API] Set the logged user role',
  props<{ role: CrudApi.Role }>(),
);
