import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IProductComponent } from '@bgap/shared/types';

import {
  IProductComponentsState,
  PRODUCT_COMPONENTS_FEATURE_KEY,
  productComponentsAdapter,
} from './product-components.reducer';

export const getProductComponentsState = createFeatureSelector<
  IProductComponentsState
>(PRODUCT_COMPONENTS_FEATURE_KEY);

const { selectAll, selectEntities } = productComponentsAdapter.getSelectors();

export const getProductComponentsError = createSelector(
  getProductComponentsState,
  (state: IProductComponentsState) => state.error,
);

export const getAllProductComponents = createSelector(
  getProductComponentsState,
  (state: IProductComponentsState) => selectAll(state),
);

export const getProductComponentsEntities = createSelector(
  getProductComponentsState,
  (state: IProductComponentsState) => selectEntities(state),
);

export const getProductComponentById = (id: string) => {
  return createSelector(
    getAllProductComponents,
    (productComponents: IProductComponent[]): IProductComponent | undefined =>
      productComponents.find(
        (productComponent): boolean => productComponent.id === id,
      ),
  );
};
