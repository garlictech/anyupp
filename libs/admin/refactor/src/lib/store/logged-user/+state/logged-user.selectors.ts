import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  LoggedUserState,
  LOGGED_USER_FEATURE_KEY,
} from './logged-user.reducer';

export const getLoggedUserState = createFeatureSelector<LoggedUserState>(
  LOGGED_USER_FEATURE_KEY,
);

export const getLoggedUser = createSelector(
  getLoggedUserState,
  (state: LoggedUserState) => state.loggedUser,
);

export const getLoggedUserSettings = createSelector(
  getLoggedUserState,
  (state: LoggedUserState) => state.loggedUser?.settings,
);

export const getLoggedUserRole = createSelector(
  getLoggedUserState,
  (state: LoggedUserState) => state.role,
);

export const getSelectedChainId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedChainId,
);

export const hasSelectedChainId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): boolean =>
    !!state.loggedUser?.settings?.selectedChainId,
);

export const getSelectedGroupId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedGroupId,
);

export const hasSelectedGroupId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): boolean =>
    !!state.loggedUser?.settings?.selectedGroupId,
);

export const getSelectedUnitId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedUnitId,
);

export const hasSelectedUnitId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): boolean =>
    !!state.loggedUser?.settings?.selectedUnitId,
);

export const getSelectedProductCategoryId = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedProductCategoryId,
);

export const getSelectedLanguage = createSelector(
  getLoggedUserState,
  (state: LoggedUserState): string | undefined | null =>
    state.loggedUser?.settings?.selectedLanguage,
);

export const getCurrentContextRole = createSelector(
  getLoggedUserState,
  (state: LoggedUserState) => state.currentContextRole,
);
