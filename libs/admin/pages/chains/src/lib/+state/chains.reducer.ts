import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ChainsActions from './chains.actions';
import { ChainsEntity } from './chains.models';

export const CHAINS_FEATURE_KEY = 'chains';

export interface State extends EntityState<ChainsEntity> {
  selectedId?: string | number; // which Chains record has been selected
  loaded: boolean; // has the Chains list been loaded
  error?: string | null; // last known error (if any)
}

export interface ChainsPartialState {
  readonly [CHAINS_FEATURE_KEY]: State;
}

export const chainsAdapter: EntityAdapter<ChainsEntity> = createEntityAdapter<
  ChainsEntity
>();

export const initialState: State = chainsAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const chainsReducer = createReducer(
  initialState,
  on(ChainsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ChainsActions.loadChainsSuccess, (state, { chains }) =>
    chainsAdapter.setAll(chains, { ...state, loaded: true })
  ),
  on(ChainsActions.loadChainsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return chainsReducer(state, action);
}
