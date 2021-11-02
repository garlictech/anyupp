import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[Chains] Init');

export const upsertChains = createAction(
  '[Chains] Upsert chains',
  props<{ chains: CrudApi.Chain[] }>(),
);

export const resetChains = createAction('[Chains] Reset chains');

export const createChain = createAction(
  '[Chains] Create chain',
  props<{ formValue: CrudApi.CreateChainInput }>(),
);

export const updateChain = createAction(
  '[Chains] Update chain',
  props<{ formValue: CrudApi.UpdateChainInput }>(),
);

export const updateChainImageStyles = createAction(
  '[Chains] Update chain image styles',
  props<{ chainId: string; image?: string; param: string }>(),
);
