import { IAdminUser } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const loadLoggedUserSuccess = createAction(
  '[LoggedUser/API] Load LoggedUser Success',
  props<{ loggedUser: IAdminUser }>()
);

export const loadLoggedUserFailure = createAction(
  '[LoggedUser/API] Load LoggedUser Failure',
  props<{ error: any }>()
);

export const resetLoggedUser = createAction(
  '[LoggedUser/API] Reset LoggedUser'
);
