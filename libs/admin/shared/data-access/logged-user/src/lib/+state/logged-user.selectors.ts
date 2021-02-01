import {
  IAdminUser,
  IAdminUserRole,
  IAdminUserSettings,
} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ILoggedUserState,
  LOGGED_USER_FEATURE_KEY,
} from './logged-user.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const getLoggedUserState = createFeatureSelector<ILoggedUserState>(
  LOGGED_USER_FEATURE_KEY
);

export const getLoggedUser = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): IAdminUser => state.loggedUser!
);

export const getLoggedUserSettings = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): IAdminUserSettings => state.loggedUser!.settings!
);

export const getLoggedUserRoles = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): IAdminUserRole => state.loggedUser?.roles!
);

export const getSelectedChainId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string =>
    state.loggedUser?.settings?.selectedChainId!
);

export const getSelectedGroupId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string =>
    state.loggedUser?.settings?.selectedGroupId!
);

export const getSelectedUnitId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string =>
    state.loggedUser?.settings?.selectedUnitId!
);

export const getSelectedProductCategoryId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string =>
    state.loggedUser?.settings?.selectedProductCategoryId!
);

export const getSelectedLanguage = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string =>
    state.loggedUser?.settings?.selectedLanguage!
);
