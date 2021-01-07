import { get as _get } from 'lodash-es';
import { IAdminUserSettings, IChain } from '../../shared/interfaces';

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { chainListAdapter } from '../reducer';
import { IChainEntityState, IChainListState } from '../state';
import * as currentUserSelectors from './current-user';

const featureSelector = createFeatureSelector<IChainListState>('chainList');

const chainListSelector: MemoizedSelector<
  object,
  IChainEntityState
> = createSelector(
  featureSelector,
  (state: IChainListState): IChainEntityState => state.chains
);
export const getAllChains = chainListAdapter.getSelectors(chainListSelector)
  .selectAll;
export const getAllChainIds = chainListAdapter.getSelectors(chainListSelector)
  .selectIds;
export const getAllChainCount = chainListAdapter.getSelectors(chainListSelector)
  .selectTotal;

export const getChainById = (id: string): MemoizedSelector<object, IChain> => {
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
      (chain): boolean => chain._id === _get(userSettings, 'selectedChainId')
    )
);
