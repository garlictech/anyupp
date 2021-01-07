import { get as _get } from 'lodash-es';
import { IAdminUserSettings, IUnit } from 'src/app/shared/interfaces';

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { unitListAdapter } from '../reducer';
import { IUnitEntityState, IUnitListState } from '../state';
import * as currentUserSelectors from './current-user';

const featureSelector = createFeatureSelector<IUnitListState>('unitList');

const unitListSelector: MemoizedSelector<
  object,
  IUnitEntityState
> = createSelector(
  featureSelector,
  (state: IUnitListState): IUnitEntityState => state.units
);
export const getAllUnits = unitListAdapter.getSelectors(unitListSelector)
  .selectAll;
export const getAllUnitIds = unitListAdapter.getSelectors(unitListSelector)
  .selectIds;
export const getAllUnitCount = unitListAdapter.getSelectors(unitListSelector)
  .selectTotal;

export const getUnitById = (id: string): MemoizedSelector<object, IUnit> => {
  return createSelector(
    getAllUnits,
    (units: IUnit[]): IUnit => units.find((unit): boolean => unit._id === id)
  );
};

export const getUnitsByGroupId = (
  groupId: string
): MemoizedSelector<object, IUnit[]> => {
  return createSelector(getAllUnits, (units: IUnit[]): IUnit[] =>
    units.filter((unit): boolean => unit.groupId === groupId)
  );
};

export const getSelectedGroupUnits = createSelector(
  currentUserSelectors.getAdminUserSettings,
  getAllUnits,
  (userSettings: IAdminUserSettings, units: IUnit[]): IUnit[] =>
    units.filter(
      (unit): boolean => unit.groupId === _get(userSettings, 'selectedGroupId')
    )
);

export const getSelectedUnit = createSelector(
  currentUserSelectors.getAdminUserSettings,
  getAllUnits,
  (userSettings: IAdminUserSettings, units: IUnit[]): IUnit =>
    units.find(
      (unit): boolean => unit._id === _get(userSettings, 'selectedUnitId')
    )
);
