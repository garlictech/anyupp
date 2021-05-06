import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  IProductComponentSetsState,
  PRODUCT_COMPONENT_SETS_FEATURE_KEY,
  productComponentSetsAdapter,
} from './product-component-sets.reducer';

export const getProductComponentSetsState = createFeatureSelector<
  IProductComponentSetsState
>(PRODUCT_COMPONENT_SETS_FEATURE_KEY);

const { selectAll, selectEntities } = productComponentSetsAdapter.getSelectors();

export const getProductComponentSetsError = createSelector(
  getProductComponentSetsState,
  (state: IProductComponentSetsState) => state.error,
);

export const getAllProductComponentSets = createSelector(
  getProductComponentSetsState,
  (state: IProductComponentSetsState) => selectAll(state),
);

export const getProductComponentSetsEntities = createSelector(
  getProductComponentSetsState,
  (state: IProductComponentSetsState) => selectEntities(state),
);
