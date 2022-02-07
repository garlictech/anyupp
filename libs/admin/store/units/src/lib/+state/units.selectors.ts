import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UNITS_FEATURE_KEY, unitsAdapter, UnitsState } from './units.reducer';

export const getUnitsState =
  createFeatureSelector<UnitsState>(UNITS_FEATURE_KEY);

const { selectAll, selectEntities } = unitsAdapter.getSelectors();

export const getUnitsError = createSelector(
  getUnitsState,
  (state: UnitsState) => state.error,
);

export const getAllUnits = createSelector(getUnitsState, (state: UnitsState) =>
  selectAll(state),
);

export const getUnitsEntities = createSelector(
  getUnitsState,
  (state: UnitsState) => selectEntities(state),
);

export const getUnitById = (id: string) => {
  return createSelector(
    getAllUnits,
    (units: CrudApi.Unit[]): CrudApi.Unit | undefined =>
      units.find((unit): boolean => unit.id === id),
  );
};

export const getUnitsByGroupId = (groupId: string) => {
  return createSelector(getAllUnits, (units: CrudApi.Unit[]): CrudApi.Unit[] =>
    units.filter((unit): boolean => unit.groupId === groupId),
  );
};

export const getSelectedGroupUnits = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllUnits,
  (userSettings, units: CrudApi.Unit[]): CrudApi.Unit[] =>
    units.filter(
      (unit): boolean => unit.groupId === userSettings?.selectedGroupId,
    ),
);

export const getSelectedUnit = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllUnits,
  (userSettings, units: CrudApi.Unit[]): CrudApi.Unit | undefined =>
    units.find((unit): boolean => unit.id === userSettings?.selectedUnitId),
);

export const getSelectedUnitLanes = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllUnits,
  (userSettings, units: CrudApi.Unit[]) =>
    units
      .find(unit => unit.id === userSettings?.selectedUnitId)
      ?.lanes?.map(lane => ({
        key: lane?.id || '',
        value: lane?.name,
      })) || [],
);
