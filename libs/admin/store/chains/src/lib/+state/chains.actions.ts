import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[Chains] Init');

export const upsertChains = createAction(
  '[Chains] Upsert chains',
  props<{ chains: CrudApi.Chain[] }>(),
);

export const resetChains = createAction('[Chains] Reset chains');
