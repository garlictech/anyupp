import { IProductCategory } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductCategoriesActions from './product-categories.actions';

export const PRODUCT_CATEGORIES_FEATURE_KEY = 'productCategories';

export interface IProductCategoriesState extends EntityState<IProductCategory> {
  error?: string | null; // last known error (if any)
}

export interface ProductCategoriesPartialState {
  readonly [PRODUCT_CATEGORIES_FEATURE_KEY]: IProductCategoriesState;
}

export const productCategoriesAdapter: EntityAdapter<IProductCategory> = createEntityAdapter<
  IProductCategory
>();

export const initialState: IProductCategoriesState = productCategoriesAdapter.getInitialState(
  {},
);

const reducer = createReducer(
  initialState,
  on(ProductCategoriesActions.init, state => ({
    ...state,
    error: null,
  })),
  on(
    ProductCategoriesActions.upsertProductCategory,
    (state, { productCategory }) =>
      productCategoriesAdapter.upsertOne(productCategory, state),
  ),
  on(ProductCategoriesActions.resetProductCategories, state =>
    productCategoriesAdapter.removeAll(state),
  ),
);

export function productCategoriesReducer(
  state: IProductCategoriesState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
