import { createFeatureSelector } from '@ngrx/store';

import { APP_CORE_FEATURE_KEY, IAppCoreState } from './app-core.reducer';

export const getAppCoreState = createFeatureSelector<IAppCoreState>(
  APP_CORE_FEATURE_KEY,
);
