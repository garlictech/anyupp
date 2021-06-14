import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  ProductCategoriesState,
  PRODUCT_CATEGORIES_FEATURE_KEY,
  productCategoriesAdapter,
} from './product-categories.reducer';

export const getProductCategoriesState = createFeatureSelector<
  ProductCategoriesState
>(PRODUCT_CATEGORIES_FEATURE_KEY);

const { selectAll, selectEntities } = productCategoriesAdapter.getSelectors();

export const getProductCategoriesError = createSelector(
  getProductCategoriesState,
  (state: ProductCategoriesState) => state.error,
);

export const getAllProductCategories = createSelector(
  getProductCategoriesState,
  (state: ProductCategoriesState) => selectAll(state),
);

export const getProductCategoriesEntities = createSelector(
  getProductCategoriesState,
  (state: ProductCategoriesState) => selectEntities(state),
);
