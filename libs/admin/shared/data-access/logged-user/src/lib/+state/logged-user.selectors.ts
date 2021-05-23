import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ILoggedUserState,
  LOGGED_USER_FEATURE_KEY,
} from './logged-user.reducer';

export const getLoggedUserState = createFeatureSelector<ILoggedUserState>(
  LOGGED_USER_FEATURE_KEY,
);

export const getLoggedUser = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState) => state.loggedUser,
);

export const getLoggedUserSettings = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState) => state.loggedUser?.settings,
);

export const getLoggedUserRole = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState) => state.role,
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

export const getCurrentContextRole = createSelector(
  getLoggedUserState,
  (state: ILoggedUserState) => state.currentContextRole,
);
