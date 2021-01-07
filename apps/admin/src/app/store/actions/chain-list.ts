import { IChain } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetChains = createAction('[ChainList] Reset chains');
export const setAllChains = createAction(
  '[ChainList] Set all chains',
  props<{ chains: IChain[] }>()
);
