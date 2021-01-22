import { IChain } from '@bgap/shared/types';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { chainListActions } from '../actions';
import { IChainListState } from '../state';

export const chainListAdapter: EntityAdapter<IChain> = createEntityAdapter<
  IChain
>({
  selectId: (item: IChain): string => item._id,
});
export const chainListInitialState: EntityState<IChain> = chainListAdapter.getInitialState();

const baseChainListReducer = createReducer(
  chainListInitialState,
  on(
    chainListActions.setAllChains,
    (state, { chains }): EntityState<IChain> =>
      chainListAdapter.setAll(chains, state)
  ),
  on(
    chainListActions.resetChains,
    (state): EntityState<IChain> => chainListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IChainListState> = {
  chains: baseChainListReducer,
};

const reducer: ActionReducer<IChainListState> = combineReducers(reducerMap);

export function chainListReducer(state: IChainListState | undefined, action: Action): IChainListState {
  return reducer(state, action);
}
