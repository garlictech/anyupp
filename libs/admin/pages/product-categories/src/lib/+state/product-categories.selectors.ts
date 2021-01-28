import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  PRODUCT_CATEGORIES_FEATURE_KEY,
  State,
  ProductCategoriesPartialState,
  productCategoriesAdapter,
} from './product-categories.reducer';

// Lookup the 'ProductCategories' feature state managed by NgRx
export const getProductCategoriesState = createFeatureSelector<
  ProductCategoriesPartialState,
  State
>(PRODUCTCATEGORIES_FEATURE_KEY);

const { selectAll, selectEntities } = productCategoriesAdapter.getSelectors();

export const getProductCategoriesLoaded = createSelector(
  getProductCategoriesState,
  (state: State) => state.loaded
);

export const getProductCategoriesError = createSelector(
  getProductCategoriesState,
  (state: State) => state.error
);

export const getAllProductCategories = createSelector(
  getProductCategoriesState,
  (state: State) => selectAll(state)
);

export const getProductCategoriesEntities = createSelector(
  getProductCategoriesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getProductCategoriesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getProductCategoriesEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId]
);
