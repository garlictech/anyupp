import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as ChainsActions from './chains.actions';
import * as CrudApi from '@bgap/crud-gql/api';

export const CHAINS_FEATURE_KEY = 'chains';

export interface ChainsState extends EntityState<CrudApi.Chain> {
  error?: string | null; // last known error (if any)
}

export interface ChainsPartialState {
  readonly [CHAINS_FEATURE_KEY]: ChainsState;
}

export const chainsAdapter: EntityAdapter<CrudApi.Chain> = createEntityAdapter<
  CrudApi.Chain
>();

export const initialState: ChainsState = chainsAdapter.getInitialState({});

const reducer = createReducer(
  initialState,
  on(ChainsActions.init, state => ({ ...state, error: null })),
  on(ChainsActions.upsertChains, (state, { chains }) =>
    chainsAdapter.upsertMany(chains, state),
  ),
  on(ChainsActions.resetChains, state => chainsAdapter.removeAll(state)),
);

export function chainsReducer(state: ChainsState | undefined, action: Action) {
  return reducer(state, action);
}
