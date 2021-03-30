import {
  EAdminRole,
  IAdminUser,
  IAdminUserSettings,
} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ILoggedUserState,
  LOGGED_USER_FEATURE_KEY,
} from './logged-user.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const getLoggedUserState = createFeatureSelector<ILoggedUserState>(
  LOGGED_USER_FEATURE_KEY,
);

export const getLoggedUser = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): IAdminUser => state.loggedUser || {},
);

export const getLoggedUserSettings = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): IAdminUserSettings | undefined =>
    state.loggedUser?.settings,
);

export const getLoggedUserRole = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): EAdminRole | undefined =>
    state.loggedUser?.role,
);

export const getSelectedChainId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedChainId,
);

export const getSelectedGroupId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedGroupId,
);

export const getSelectedUnitId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedUnitId,
);

export const getSelectedProductCategoryId = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedProductCategoryId,
);

export const getSelectedLanguage = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedLanguage,
);
