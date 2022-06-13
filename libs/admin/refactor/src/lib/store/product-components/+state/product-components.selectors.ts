import { ProductComponent } from '@bgap/domain';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';

export const productComponentEntitySelectors =
  new EntitySelectorsFactory().create<ProductComponent>(
    ENTITY_NAME.PRODUCT_COMPONENT,
  );

export const getProductComponentById = (id: string) =>
  createSelector(
    productComponentEntitySelectors.selectEntities,
    (productComponents: ProductComponent[]): ProductComponent | undefined =>
      productComponents.find(
        (productComponent): boolean => productComponent.id === id,
      ),
  );
