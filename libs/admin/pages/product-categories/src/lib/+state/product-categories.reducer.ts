import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ProductCategoriesActions from './product-categories.actions';
import { ProductCategoriesEntity } from './product-categories.models';

export const PRODUCT_CATEGORIES_FEATURE_KEY = 'productCategories';

export interface State extends EntityState<ProductCategoriesEntity> {
  selectedId?: string | number; // which ProductCategories record has been selected
  loaded: boolean; // has the ProductCategories list been loaded
  error?: string | null; // last known error (if any)
}

export interface ProductCategoriesPartialState {
  readonly [PRODUCT_CATEGORIES_FEATURE_KEY]: State;
}

export const productCategoriesAdapter: EntityAdapter<ProductCategoriesEntity> = createEntityAdapter<
  ProductCategoriesEntity
>();

export const initialState: State = productCategoriesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const productCategoriesReducer = createReducer(
  initialState,
  on(ProductCategoriesActions.init, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    ProductCategoriesActions.loadProductCategoriesSuccess,
    (state, { productCategories }) =>
      productCategoriesAdapter.setAll(productCategories, {
        ...state,
        loaded: true,
      })
  ),
  on(
    ProductCategoriesActions.loadProductCategoriesFailure,
    (state, { error }) => ({ ...state, error })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return productCategoriesReducer(state, action);
}
