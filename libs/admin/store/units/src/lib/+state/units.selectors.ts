import { ENTITY_NAME } from '@bgap/admin/shared/types';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const unitEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.Unit>(ENTITY_NAME.UNIT);

export const getUnitById = (id: string) =>
  createSelector(
    unitEntitySelectors.selectEntities,
    (units: CrudApi.Unit[]): CrudApi.Unit | undefined =>
      units.find((unit): boolean => unit.id === id),
  );

export const getSelectedUnit = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  unitEntitySelectors.selectEntities,
  (userSettings, units: CrudApi.Unit[]): CrudApi.Unit | undefined =>
    units.find((unit): boolean => unit.id === userSettings?.selectedUnitId),
);

export const getSelectedUnitLanes = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  unitEntitySelectors.selectEntities,
  (userSettings, units: CrudApi.Unit[]) =>
    units
      .find(unit => unit.id === userSettings?.selectedUnitId)
      ?.lanes?.map(lane => ({
        key: lane?.id || '',
        value: lane?.name,
      })) || [],
);
