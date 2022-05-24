import { ENTITY_NAME } from '../../../shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const productComponentEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.ProductComponent>(
    ENTITY_NAME.PRODUCT_COMPONENT,
  );

export const getProductComponentById = (id: string) =>
  createSelector(
    productComponentEntitySelectors.selectEntities,
    (
      productComponents: CrudApi.ProductComponent[],
    ): CrudApi.ProductComponent | undefined =>
      productComponents.find(
        (productComponent): boolean => productComponent.id === id,
      ),
  );
