import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductCategoriesActions from './product-categories.actions';

export const PRODUCT_CATEGORIES_FEATURE_KEY = 'productCategories';

export interface ProductCategoriesState
  extends EntityState<CrudApi.ProductCategory> {
  error?: string | null; // last known error (if any)
}

export interface ProductCategoriesPartialState {
  readonly [PRODUCT_CATEGORIES_FEATURE_KEY]: ProductCategoriesState;
}

export const productCategoriesAdapter: EntityAdapter<CrudApi.ProductCategory> =
  createEntityAdapter<CrudApi.ProductCategory>();

export const initialProductCategoryState =
  productCategoriesAdapter.getInitialState({});

const reducer = createReducer(
  initialProductCategoryState,
  on(ProductCategoriesActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductCategoriesActions.upsertProductCategories,
    (state, { productCategories }) =>
      productCategoriesAdapter.upsertMany(productCategories, state),
  ),
  on(ProductCategoriesActions.resetProductCategories, state =>
    productCategoriesAdapter.removeAll(state),
  ),
);

export function productCategoriesReducer(
  state: ProductCategoriesState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
