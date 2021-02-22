import { IChain } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Chains Page] Init');

export const loadChainsSuccess = createAction(
  '[Chains] Load Chains Success',
  props<{ chains: IChain[] }>()
);

export const resetChains = createAction('[ChainList] Reset chains');
