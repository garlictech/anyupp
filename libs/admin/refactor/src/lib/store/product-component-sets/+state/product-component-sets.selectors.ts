import { ProductComponentSet } from '@bgap/domain';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';

export const productComponentSetEntitySelectors =
  new EntitySelectorsFactory().create<ProductComponentSet>(
    ENTITY_NAME.PRODUCT_COMPONENT_SET,
  );

export const getProductComponentSetById = (id: string) =>
  createSelector(
    productComponentSetEntitySelectors.selectEntities,
    (
      productComponentSets: ProductComponentSet[],
    ): ProductComponentSet | undefined =>
      productComponentSets.find(
        (productComponentSet): boolean => productComponentSet.id === id,
      ),
  );
