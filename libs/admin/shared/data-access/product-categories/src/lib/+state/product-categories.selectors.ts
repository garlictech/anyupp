import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  IProductCategoriesState,
  PRODUCT_CATEGORIES_FEATURE_KEY,
  productCategoriesAdapter,
} from './product-categories.reducer';

// Lookup the 'ProductCategories' feature state managed by NgRx
export const getProductCategoriesState = createFeatureSelector<
  IProductCategoriesState
>(PRODUCT_CATEGORIES_FEATURE_KEY);

const { selectAll, selectEntities } = productCategoriesAdapter.getSelectors();

export const getProductCategoriesError = createSelector(
  getProductCategoriesState,
  (state: IProductCategoriesState) => state.error,
);

export const getAllProductCategories = createSelector(
  getProductCategoriesState,
  (state: IProductCategoriesState) => selectAll(state),
);

export const getProductCategoriesEntities = createSelector(
  getProductCategoriesState,
  (state: IProductCategoriesState) => selectEntities(state),
);

