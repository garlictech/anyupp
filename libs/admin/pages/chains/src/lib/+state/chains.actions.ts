import { createAction, props } from '@ngrx/store';
import { ChainsEntity } from './chains.models';

export const init = createAction('[Chains Page] Init');

export const loadChainsSuccess = createAction(
  '[Chains/API] Load Chains Success',
  props<{ chains: ChainsEntity[] }>()
);

export const loadChainsFailure = createAction(
  '[Chains/API] Load Chains Failure',
  props<{ error: any }>()
);
