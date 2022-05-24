import { ENTITY_NAME } from '../../../shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const productComponentSetEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.ProductComponentSet>(
    ENTITY_NAME.PRODUCT_COMPONENT_SET,
  );

export const getProductComponentSetById = (id: string) =>
  createSelector(
    productComponentSetEntitySelectors.selectEntities,
    (
      productComponentSets: CrudApi.ProductComponentSet[],
    ): CrudApi.ProductComponentSet | undefined =>
      productComponentSets.find(
        (productComponentSet): boolean => productComponentSet.id === id,
      ),
  );
