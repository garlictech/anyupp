import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IAdminUserSettings, IChain } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  CHAINS_FEATURE_KEY,
  chainsAdapter,
  IChainsState,
} from './chains.reducer';

// Lookup the 'Chains' feature state managed by NgRx
export const getChainsState = createFeatureSelector<IChainsState>(
  CHAINS_FEATURE_KEY
);

const { selectAll, selectEntities } = chainsAdapter.getSelectors();

export const getChainsLoaded = createSelector(
  getChainsState,
  (state: IChainsState) => state.loaded
);

export const getChainsError = createSelector(
  getChainsState,
  (state: IChainsState) => state.error
);

export const getAllChains = createSelector(
  getChainsState,
  (state: IChainsState) => selectAll(state)
);

export const getChainsEntities = createSelector(
  getChainsState,
  (state: IChainsState) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getChainsState,
  (state: IChainsState) => state.selectedId
);

export const getSelected = createSelector(
  getChainsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);

export const getChainById = (id: string) => {
  return createSelector(
    getAllChains,
    (chains: IChain[]): IChain | undefined =>
      chains.find((chain): boolean => chain._id === id)
  );
};

export const getSeletedChain = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllChains,
  (userSettings: IAdminUserSettings | undefined, chains: IChain[]): IChain | undefined =>
    chains.find((chain): boolean => chain._id === userSettings?.selectedChainId)
);
