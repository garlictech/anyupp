import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ChainsActions from './chains.actions';
import { IChain } from '@bgap/shared/types';

export const CHAINS_FEATURE_KEY = 'chains';

export interface IChainsState extends EntityState<IChain> {
  selectedId?: string | number; // which Chains record has been selected
  loaded: boolean; // has the Chains list been loaded
  error?: string | null; // last known error (if any)
}

export interface IChainsPartialState {
  readonly [CHAINS_FEATURE_KEY]: IChainsState;
}

export const chainsAdapter: EntityAdapter<IChain> = createEntityAdapter<
  IChain
>({
  selectId: (item: IChain): string => item._id,
});

export const initialState: IChainsState = chainsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const reducer = createReducer(
  initialState,
  on(ChainsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ChainsActions.loadChainsSuccess, (state, { chains }) =>
    chainsAdapter.setAll(chains, { ...state, loaded: true })
  ),
  on(ChainsActions.loadChainsFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ChainsActions.resetChains, state => chainsAdapter.removeAll(state))
);

export function chainsReducer(state: IChainsState | undefined, action: Action) {
  return reducer(state, action);
}
