import { IChain } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Chains Page] Init');

export const loadChainsSuccess = createAction(
  '[Chains] Load Chains Success',
  props<{ chains: IChain[] }>()
);

export const loadChainsFailure = createAction(
  '[Chains] Load Chains Failure',
  props<{ error: any }>()
);

export const resetChains = createAction('[ChainList] Reset chains');
