import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import {
  CHAINS_FEATURE_KEY,
  chainsAdapter,
  ChainsState,
} from './chains.reducer';

export const getChainsState =
  createFeatureSelector<ChainsState>(CHAINS_FEATURE_KEY);

const { selectAll, selectEntities } = chainsAdapter.getSelectors();

export const getChainsError = createSelector(
  getChainsState,
  (state: ChainsState) => state.error,
);

export const getAllChains = createSelector(
  getChainsState,
  (state: ChainsState) => selectAll(state),
);

export const getChainsEntities = createSelector(
  getChainsState,
  (state: ChainsState) => selectEntities(state),
);

export const getChainById = (id: string) => {
  return createSelector(
    getAllChains,
    (chains: CrudApi.Chain[]): CrudApi.Chain | undefined =>
      chains.find((chain): boolean => chain.id === id),
  );
};

export const getSeletedChain = createSelector(
  loggedUserSelectors.getLoggedUserSettings,
  getAllChains,
  (
    userSettings: CrudApi.AdminUserSettings | undefined | null,
    chains: CrudApi.Chain[],
  ) =>
    chains.find((chain): boolean => chain.id === userSettings?.selectedChainId),
);
