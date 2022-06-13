import { Unit } from '@bgap/domain';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

export const unitEntitySelectors = new EntitySelectorsFactory().create<Unit>(
  ENTITY_NAME.UNIT,
);

export const getUnitById = (id: string) =>
  createSelector(
    unitEntitySelectors.selectEntities,
    (units: Unit[]): Unit | undefined =>
      units.find((unit): boolean => unit.id === id),
  );

export const getSelectedUnit = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  unitEntitySelectors.selectEntities,
  (userSettings, units: Unit[]): Unit | undefined =>
    units.find((unit): boolean => unit.id === userSettings?.selectedUnitId),
);

export const getSelectedUnitLanes = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  unitEntitySelectors.selectEntities,
  (userSettings, units: Unit[]) =>
    units
      .find(unit => unit.id === userSettings?.selectedUnitId)
      ?.lanes?.map(lane => ({
        key: lane?.id || '',
        value: lane?.name,
      })) || [],
);
