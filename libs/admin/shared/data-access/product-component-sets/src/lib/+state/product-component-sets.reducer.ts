import { IProductComponentSet } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductComponentSetsActions from './product-component-sets.actions';

export const PRODUCT_COMPONENT_SETS_FEATURE_KEY = 'productComponentSets';

export interface IProductComponentSetsState
  extends EntityState<IProductComponentSet> {
  error?: string | null; // last known error (if any)
}

export interface ProductComponentSetsPartialState {
  readonly [PRODUCT_COMPONENT_SETS_FEATURE_KEY]: IProductComponentSetsState;
}

export const productComponentSetsAdapter: EntityAdapter<IProductComponentSet> = createEntityAdapter<
  IProductComponentSet
>();

export const initialState: IProductComponentSetsState = productComponentSetsAdapter.getInitialState(
  {},
);

const reducer = createReducer(
  initialState,
  on(ProductComponentSetsActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductComponentSetsActions.upsertProductComponentSet,
    (state, { productComponentSet }) =>
      productComponentSetsAdapter.upsertOne(productComponentSet, state),
  ),
  on(ProductComponentSetsActions.resetProductComponentSets, state =>
    productComponentSetsAdapter.removeAll(state),
  ),
);

export function productComponentSetsReducer(
  state: IProductComponentSetsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
