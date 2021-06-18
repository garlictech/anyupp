import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import {
  ProductComponentSetsState,
  PRODUCT_COMPONENT_SETS_FEATURE_KEY,
  productComponentSetsAdapter,
} from './product-component-sets.reducer';

export const getProductComponentSetsState =
  createFeatureSelector<ProductComponentSetsState>(
    PRODUCT_COMPONENT_SETS_FEATURE_KEY,
  );

const { selectAll, selectEntities } =
  productComponentSetsAdapter.getSelectors();

export const getProductComponentSetsError = createSelector(
  getProductComponentSetsState,
  (state: ProductComponentSetsState) => state.error,
);

export const getAllProductComponentSets = createSelector(
  getProductComponentSetsState,
  (state: ProductComponentSetsState) => selectAll(state),
);

export const getProductComponentSetsEntities = createSelector(
  getProductComponentSetsState,
  (state: ProductComponentSetsState) => selectEntities(state),
);

export const getProductComponentSetById = (id: string) => {
  return createSelector(
    getAllProductComponentSets,
    (
      productComponentSets: CrudApi.ProductComponentSet[],
    ): CrudApi.ProductComponentSet | undefined =>
      productComponentSets.find(
        (productComponentSet): boolean => productComponentSet.id === id,
      ),
  );
};
