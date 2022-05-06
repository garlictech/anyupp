import { ENTITY_NAME } from '@bgap/admin/shared/types';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';
import { ExtendedGroupProduct, ExtendedUnitProduct } from './products.reducer';

export const chainProductEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.ChainProduct>(
    ENTITY_NAME.CHAIN_PRODUCT,
  );

export const groupProductEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.GroupProduct>(
    ENTITY_NAME.GROUP_PRODUCT,
  );

export const unitProductEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.UnitProduct>(
    ENTITY_NAME.UNIT_PRODUCT,
  );

export const generatedProductEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.GeneratedProduct>(
    ENTITY_NAME.GENERATED_PRODUCT,
  );

export const getPendingGroupProductsOfSelectedCategory = createSelector(
  chainProductEntitySelectors.selectFilteredEntities,
  groupProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (chainProducts, groupProducts, productCategoryId) =>
    chainProducts.filter(chainProduct => {
      const found = groupProducts.filter(
        groupProduct =>
          groupProduct?.parentId === chainProduct.id &&
          !groupProduct?.deletedAt,
      ).length;

      return (
        !found &&
        !!productCategoryId &&
        !chainProduct.dirty &&
        chainProduct.productCategoryId === productCategoryId
      );
    }),
);

export const getExtendedGroupProductsOfSelectedCategory = createSelector(
  chainProductEntitySelectors.selectFilteredEntities,
  groupProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (chainProducts, groupProducts, productCategoryId) => {
    const extendedGroupProducts: ExtendedGroupProduct[] = [];

    groupProducts.forEach(groupProduct => {
      const chainProduct = chainProducts.find(
        p => p.id === groupProduct.parentId,
      );

      if (chainProduct) {
        extendedGroupProducts.push(
          Object.assign({}, chainProduct, groupProduct),
        );
      }
    });

    return extendedGroupProducts.filter(
      (extendedGroupProduct: ExtendedGroupProduct) =>
        !!productCategoryId &&
        extendedGroupProduct.productCategoryId === productCategoryId,
    );
  },
);

export const getPendingUnitProductsOfSelectedCategory = createSelector(
  getExtendedGroupProductsOfSelectedCategory,
  unitProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (groupProducts, unitProducts, productCategoryId) =>
    groupProducts.filter(groupProduct => {
      const found = unitProducts.filter(
        unitProduct =>
          unitProduct?.parentId === groupProduct.id && !unitProduct?.deletedAt,
      ).length;

      return (
        !found &&
        !!productCategoryId &&
        !groupProduct.dirty &&
        groupProduct.productCategoryId === productCategoryId
      );
    }),
);

export const getExtendedUnitProductsOfSelectedCategory = createSelector(
  getExtendedGroupProductsOfSelectedCategory,
  unitProductEntitySelectors.selectFilteredEntities,
  loggedUserSelectors.getSelectedProductCategoryId,
  (extendedGroupProducts, unitProducts, productCategoryId) => {
    const extendedUnitProducts: ExtendedUnitProduct[] = [];

    unitProducts.forEach(unitProduct => {
      const extendedGroupProduct = extendedGroupProducts.find(
        p => p.id === unitProduct.parentId,
      );

      if (extendedGroupProduct) {
        extendedUnitProducts.push(
          Object.assign({}, extendedGroupProduct, unitProduct),
        );
      }
    });
    return extendedUnitProducts.filter(
      extendedGroupProduct =>
        !!productCategoryId &&
        extendedGroupProduct.productCategoryId === productCategoryId,
    );
  },
);

export const getUnitProductLaneIds = createSelector(
  unitProductEntitySelectors.selectEntities,
  products =>
    [...new Set(products.map(product => product.laneId || ''))].filter(
      id => !!id,
    ),
);

export const getGeneratedProductImageById = (id: string) =>
  createSelector(
    generatedProductEntitySelectors.selectEntities,
    products => products.find(product => product.id === id)?.image || '',
  );
