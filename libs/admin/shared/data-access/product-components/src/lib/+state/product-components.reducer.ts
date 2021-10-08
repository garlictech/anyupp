import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductComponentsActions from './product-components.actions';

export const PRODUCT_COMPONENTS_FEATURE_KEY = 'productComponents';

export interface ProductComponentsState
  extends EntityState<CrudApi.ProductComponent> {
  error?: string | null; // last known error (if any)
}

export interface ProductComponentsPartialState {
  readonly [PRODUCT_COMPONENTS_FEATURE_KEY]: ProductComponentsState;
}

export const productComponentsAdapter: EntityAdapter<CrudApi.ProductComponent> =
  createEntityAdapter<CrudApi.ProductComponent>();

export const initialProductComponentsState: ProductComponentsState =
  productComponentsAdapter.getInitialState({});

const reducer = createReducer(
  initialProductComponentsState,
  on(ProductComponentsActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductComponentsActions.upsertProductComponents,
    (state, { productComponents }) =>
      productComponentsAdapter.upsertMany(productComponents, state),
  ),
  on(ProductComponentsActions.resetProductComponents, state =>
    productComponentsAdapter.removeAll(state),
  ),
);

export function productComponentsReducer(
  state: ProductComponentsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
