import { createFeatureSelector, createSelector } from '@ngrx/store';

import { APP_CORE_FEATURE_KEY, AppCoreState } from './app-core.reducer';

export const getAppCoreState =
  createFeatureSelector<AppCoreState>(APP_CORE_FEATURE_KEY);

export const getLoginContextFailure = createSelector(
  getAppCoreState,
  (state: AppCoreState) => state.loginContextFailure,
);

export const getClosableDialog = createSelector(
  getAppCoreState,
  (state: AppCoreState) => state.closableDialog,
);

export const getChainRestrictionsByUserId = (id: string) =>
  createSelector(
    getAppCoreState,
    (state: AppCoreState) => state.chainRestrictions[id] || [],
  );
