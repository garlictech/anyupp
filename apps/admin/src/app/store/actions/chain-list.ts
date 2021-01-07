import { createAction, props } from '@ngrx/store';
import { IChain } from '../../shared/interfaces';

export const resetChains = createAction('[ChainList] Reset chains');
export const setAllChains = createAction(
  '[ChainList] Set all chains',
  props<{ chains: IChain[] }>()
);
