import { IAdminUserSettings, IChain } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  CHAINS_FEATURE_KEY,
  State,
  ChainsPartialState,
  chainsAdapter,
} from './chains.reducer';

// Lookup the 'Chains' feature state managed by NgRx
export const getChainsState = createFeatureSelector<ChainsPartialState, State>(
  CHAINS_FEATURE_KEY
);

const { selectAll, selectEntities } = chainsAdapter.getSelectors();

export const getChainsLoaded = createSelector(
  getChainsState,
  (state: State) => state.loaded
);

export const getChainsError = createSelector(
  getChainsState,
  (state: State) => state.error
);

export const getAllChains = createSelector(getChainsState, (state: State) =>
  selectAll(state)
);

export const getChainsEntities = createSelector(
  getChainsState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getChainsState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getChainsEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);


export const getChainById = (id: string) => {
  return createSelector(
    getAllChains,
    (chains: IChain[]): IChain =>
      chains.find((chain): boolean => chain._id === id)
  );
};

export const getSeletedChain = createSelector(
  currentUserSelectors.getAdminUserSettings,
  getAllChains,
  (userSettings: IAdminUserSettings, chains: IChain[]): IChain =>
    chains.find(
      (chain): boolean => chain._id === userSettings?.selectedChainId)
    )
);
