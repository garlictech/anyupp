import { createFeatureSelector, createSelector } from '@ngrx/store';

import { APP_CORE_FEATURE_KEY, IAppCoreState } from './app-core.reducer';

export const getAppCoreState =
  createFeatureSelector<IAppCoreState>(APP_CORE_FEATURE_KEY);

export const getLoginContextFailure = createSelector(
  getAppCoreState,
  (state: IAppCoreState) => state.loginContextFailure,
);

export const getClosableDialog = createSelector(
  getAppCoreState,
  (state: IAppCoreState) => state.closableDialog,
);
