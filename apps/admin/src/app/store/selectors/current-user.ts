import { get as _get } from 'lodash-es';
import {
  IAdminUser,
  IAdminUserRole,
  IAdminUserSettings,
} from '@bgap/shared/types/interfaces';

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ICurrentUserState } from '../state';

const featureSelector = createFeatureSelector<ICurrentUserState>('currentUser');

export const getAdminUser = createSelector(
  featureSelector,
  (state: ICurrentUserState): IAdminUser => state.adminUser
);

export const getAdminUserSettings = createSelector(
  featureSelector,
  (state: ICurrentUserState): IAdminUserSettings =>
    _get(state.adminUser, 'settings')
);

export const getAdminUserRoles = createSelector(
  featureSelector,
  (state: ICurrentUserState): IAdminUserRole => _get(state.adminUser, 'roles')
);

export const getSelectedChainId = createSelector(
  featureSelector,
  (state: ICurrentUserState): string =>
    _get(state.adminUser, 'settings.selectedChainId')
);

export const getSelectedGroupId = createSelector(
  featureSelector,
  (state: ICurrentUserState): string =>
    _get(state.adminUser, 'settings.selectedGroupId')
);

export const getSelectedUnitId = createSelector(
  featureSelector,
  (state: ICurrentUserState): string =>
    _get(state.adminUser, 'settings.selectedUnitId')
);

export const getSelectedProductCategoryId = createSelector(
  featureSelector,
  (state: ICurrentUserState): string =>
    _get(state.adminUser, 'settings.selectedProductCategoryId')
);

export const getSelectedLanguage = createSelector(
  featureSelector,
  (state: ICurrentUserState): string =>
    _get(state.adminUser, 'settings.selectedLanguage')
);
