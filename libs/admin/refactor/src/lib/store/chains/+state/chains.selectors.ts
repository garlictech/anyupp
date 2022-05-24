import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const chainEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.Chain>(ENTITY_NAME.CHAIN);

export const getSelectedChain = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  chainEntitySelectors.selectEntities,
  (
    userSettings: CrudApi.AdminUserSettings | undefined | null,
    chains: CrudApi.Chain[],
  ) =>
    chains.find((chain): boolean => chain.id === userSettings?.selectedChainId),
);

export const getAllChainOptions = () =>
  createSelector(
    chainEntitySelectors.selectEntities,
    (chains: CrudApi.Chain[]): KeyValue[] =>
      (chains || []).map(chain => ({
        key: chain.id,
        value: chain.name,
      })),
  );
