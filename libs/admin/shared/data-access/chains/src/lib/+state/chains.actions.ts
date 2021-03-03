import { IChain } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Chains Page] Init');

export const upsertChain = createAction(
  '[Chains] Upsert Chain',
  props<{ chain: IChain }>(),
);

export const resetChains = createAction('[ChainList] Reset chains');
