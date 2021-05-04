import { IChain } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[Chains] Init');

export const upsertChain = createAction(
  '[Chains] Upsert chain',
  props<{ chain: IChain }>(),
);

export const resetChains = createAction('[Chains] Reset chains');
