import { IProductComponent } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductComponentsActions from './product-components.actions';

export const PRODUCT_COMPONENTS_FEATURE_KEY = 'productComponents';

export interface IProductComponentsState
  extends EntityState<IProductComponent> {
  error?: string | null; // last known error (if any)
}

export interface ProductComponentsPartialState {
  readonly [PRODUCT_COMPONENTS_FEATURE_KEY]: IProductComponentsState;
}

export const productComponentsAdapter: EntityAdapter<IProductComponent> = createEntityAdapter<
  IProductComponent
>();

export const initialState: IProductComponentsState = productComponentsAdapter.getInitialState(
  {},
);

const reducer = createReducer(
  initialState,
  on(ProductComponentsActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductComponentsActions.upsertProductComponent,
    (state, { productComponent }) =>
      productComponentsAdapter.upsertOne(productComponent, state),
  ),
  on(ProductComponentsActions.resetProductComponents, state =>
    productComponentsAdapter.removeAll(state),
  ),
);

export function productComponentsReducer(
  state: IProductComponentsState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
