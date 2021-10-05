import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductComponentSetsActions from './product-component-sets.actions';

export const PRODUCT_COMPONENT_SETS_FEATURE_KEY = 'productComponentSets';

export interface ProductComponentSetsState
  extends EntityState<CrudApi.ProductComponentSet> {
  error?: string | null; // last known error (if any)
}

export interface ProductComponentSetsPartialState {
  readonly [PRODUCT_COMPONENT_SETS_FEATURE_KEY]: ProductComponentSetsState;
}

export const productComponentSetsAdapter: EntityAdapter<CrudApi.ProductComponentSet> =
  createEntityAdapter<CrudApi.ProductComponentSet>();

export const initialProductComponentSetsState: ProductComponentSetsState =
  productComponentSetsAdapter.getInitialState({});

const reducer = createReducer(
  initialProductComponentSetsState,
  on(ProductComponentSetsActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductComponentSetsActions.upsertProductComponentSets,
    (state, { productComponentSets }) =>
      productComponentSetsAdapter.upsertMany(productComponentSets, state),
  ),
  on(ProductComponentSetsActions.resetProductComponentSets, state =>
    productComponentSetsAdapter.removeAll(state),
  ),
);

export function productComponentSetsReducer(
  state: ProductComponentSetsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
