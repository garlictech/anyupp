import { AdminUserSettings, Group } from '@bgap/domain';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

export const groupEntitySelectors = new EntitySelectorsFactory().create<Group>(
  ENTITY_NAME.GROUP,
);

export const getSeletedGroup = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  groupEntitySelectors.selectEntities,
  (userSettings: AdminUserSettings | undefined | null, groups: Group[]) =>
    groups.find((group): boolean => group.id === userSettings?.selectedGroupId),
);
