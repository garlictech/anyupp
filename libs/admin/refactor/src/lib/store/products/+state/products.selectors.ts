import { UnitProduct } from '@bgap/domain';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../logged-user';

export const unitProductEntitySelectors =
  new EntitySelectorsFactory().create<UnitProduct>(ENTITY_NAME.UNIT_PRODUCT);

export const getUnitProductLaneIds = createSelector(
  unitProductEntitySelectors.selectEntities,
  products =>
    [...new Set(products.map(product => product.laneId || ''))].filter(
      id => !!id,
    ),
);

export const getUnitProductImageById = (id: string) =>
  createSelector(
    unitProductEntitySelectors.selectEntities,
    products => products.find(product => product.id === id)?.image || '',
  );

export const getUnitProductsOfSelectedCategory = createSelector(
  unitProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (unitProducts, productCategoryId) => {
    return unitProducts.filter(
      product => product.productCategoryId === productCategoryId,
    );
  },
);

export const getPendingUnitProductsOfSelectedCategory = createSelector(
  unitProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (unitProducts, productCategoryId) =>
    unitProducts.filter(
      unitProduct =>
        unitProduct.productCategoryId === productCategoryId &&
        !unitProduct.dirty,
    ),
);
