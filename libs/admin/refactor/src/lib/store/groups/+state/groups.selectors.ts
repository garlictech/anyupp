import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const groupEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.Group>(ENTITY_NAME.GROUP);

export const getSeletedGroup = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  groupEntitySelectors.selectEntities,
  (
    userSettings: CrudApi.AdminUserSettings | undefined | null,
    groups: CrudApi.Group[],
  ) =>
    groups.find((group): boolean => group.id === userSettings?.selectedGroupId),
);
