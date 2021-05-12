import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IProductComponentSet } from '@bgap/shared/types';

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

export const getProductComponentSetById = (id: string) => {
  return createSelector(getAllProductComponentSets, (productComponentSets: IProductComponentSet[]): IProductComponentSet | undefined =>
  productComponentSets.find((productComponentSet): boolean => productComponentSet.id === id),
  );
};
