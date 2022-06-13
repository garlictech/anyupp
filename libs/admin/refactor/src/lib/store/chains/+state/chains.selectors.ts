import { AdminUserSettings, Chain } from '@bgap/domain';
import { KeyValue } from '@bgap/shared/types';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

export const chainEntitySelectors = new EntitySelectorsFactory().create<Chain>(
  ENTITY_NAME.CHAIN,
);

export const getSelectedChain = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  chainEntitySelectors.selectEntities,
  (userSettings: AdminUserSettings | undefined | null, chains: Chain[]) =>
    chains.find((chain): boolean => chain.id === userSettings?.selectedChainId),
);

export const getAllChainOptions = () =>
  createSelector(
    chainEntitySelectors.selectEntities,
    (chains: Chain[]): KeyValue[] =>
      (chains || []).map(chain => ({
        key: chain.id,
        value: chain.name,
      })),
  );
