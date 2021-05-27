import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import {
  ProductComponentsState,
  PRODUCT_COMPONENTS_FEATURE_KEY,
  productComponentsAdapter,
} from './product-components.reducer';

export const getProductComponentsState = createFeatureSelector<
  ProductComponentsState
>(PRODUCT_COMPONENTS_FEATURE_KEY);

const { selectAll, selectEntities } = productComponentsAdapter.getSelectors();

export const getProductComponentsError = createSelector(
  getProductComponentsState,
  (state: ProductComponentsState) => state.error,
);

export const getAllProductComponents = createSelector(
  getProductComponentsState,
  (state: ProductComponentsState) => selectAll(state),
);

export const getProductComponentsEntities = createSelector(
  getProductComponentsState,
  (state: ProductComponentsState) => selectEntities(state),
);

export const getProductComponentById = (id: string) => {
  return createSelector(
    getAllProductComponents,
    (
      productComponents: CrudApi.ProductComponent[],
    ): CrudApi.ProductComponent | undefined =>
      productComponents.find(
        (productComponent): boolean => productComponent.id === id,
      ),
  );
};
