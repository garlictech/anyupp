import { EAdminRole } from '@bgap/shared/types';
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
  props<{ currentContextRole: EAdminRole }>(),
);
