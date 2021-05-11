import { EAdminRole, IAdminUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const loadLoggedUserSuccess = createAction(
  '[LoggedUser/API] Load LoggedUser Success',
  props<{ loggedUser: IAdminUser }>(),
);

export const resetLoggedUser = createAction(
  '[LoggedUser/API] Reset LoggedUser',
);

export const setCurrentContextRole = createAction(
  '[LoggedUser/API] Set the current context',
  props<{ currentContextRole: EAdminRole }>(),
);
