import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

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

export const getAllChainOptions = () => {
  return createSelector(getAllChains, (chains: CrudApi.Chain[]): KeyValue[] =>
    (chains || []).map(chain => ({
      key: chain.id,
      value: chain.name,
    })),
  );
};
