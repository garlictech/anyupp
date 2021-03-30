import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IAdminUserSettings, IUnit } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IUnitsState, UNITS_FEATURE_KEY, unitsAdapter } from './units.reducer';

// Lookup the 'Units' feature state managed by NgRx
export const getUnitsState = createFeatureSelector<IUnitsState>(
  UNITS_FEATURE_KEY,
);

const { selectAll, selectEntities } = unitsAdapter.getSelectors();

export const getUnitsError = createSelector(
  getUnitsState,
  (state: IUnitsState) => state.error,
);

export const getAllUnits = createSelector(getUnitsState, (state: IUnitsState) =>
  selectAll(state),
);

export const getUnitsEntities = createSelector(
  getUnitsState,
  (state: IUnitsState) => selectEntities(state),
);

export const getUnitById = (id: string) => {
  return createSelector(getAllUnits, (units: IUnit[]): IUnit | undefined =>
    units.find((unit): boolean => unit.id === id),
  );
};

export const getUnitsByGroupId = (groupId: string) => {
  return createSelector(getAllUnits, (units: IUnit[]): IUnit[] =>
    units.filter((unit): boolean => unit.groupId === groupId),
  );
};

export const getSelectedGroupUnits = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllUnits,
  (userSettings: IAdminUserSettings | undefined, units: IUnit[]): IUnit[] =>
    units.filter(
      (unit): boolean => unit.groupId === userSettings?.selectedGroupId,
    ),
);

export const getSelectedUnit = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllUnits,
  (
    userSettings: IAdminUserSettings | undefined,
    units: IUnit[],
  ): IUnit | undefined =>
    units.find((unit): boolean => unit.id === userSettings?.selectedUnitId),
);
