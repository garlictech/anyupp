import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IAdminUserSettings, IChain } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  CHAINS_FEATURE_KEY,
  chainsAdapter,
  IChainsState,
} from './chains.reducer';

export const getChainsState = createFeatureSelector<IChainsState>(
  CHAINS_FEATURE_KEY,
);

const { selectAll, selectEntities } = chainsAdapter.getSelectors();

export const getChainsError = createSelector(
  getChainsState,
  (state: IChainsState) => state.error,
);

export const getAllChains = createSelector(
  getChainsState,
  (state: IChainsState) => selectAll(state),
);

export const getChainsEntities = createSelector(
  getChainsState,
  (state: IChainsState) => selectEntities(state),
);

export const getChainById = (id: string) => {
  return createSelector(getAllChains, (chains: IChain[]): IChain | undefined =>
    chains.find((chain): boolean => chain.id === id),
  );
};

export const getSeletedChain = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllChains,
  (
    userSettings: IAdminUserSettings | undefined,
    chains: IChain[],
  ): IChain | undefined =>
    chains.find((chain): boolean => chain.id === userSettings?.selectedChainId),
);
