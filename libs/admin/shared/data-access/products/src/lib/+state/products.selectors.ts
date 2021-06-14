import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  chainProductsAdapter,
  generatedProductsAdapter,
  groupProductsAdapter,
  PRODUCTS_FEATURE_KEY,
  ProductsState,
  unitProductsAdapter,
  ExtendedGroupProduct,
  ExtendedUnitProduct,
} from './products.reducer';

export const getProductsState =
  createFeatureSelector<ProductsState>(PRODUCTS_FEATURE_KEY);

// CHAIN PRODUCTS

const chainProductListSelector = createSelector(
  getProductsState,
  (state: ProductsState) => state.chainProducts,
);
export const getAllChainProducts = chainProductsAdapter.getSelectors(
  chainProductListSelector,
).selectAll;
export const getAllChainProductIds = chainProductsAdapter.getSelectors(
  chainProductListSelector,
).selectIds;
export const getAllChainProductCount = chainProductsAdapter.getSelectors(
  chainProductListSelector,
).selectTotal;

export const getChainProductById = (id: string) => {
  return createSelector(getAllChainProducts, products =>
    products.find(product => product.id === id),
  );
};

export const getChainProductsOfSelectedCategory = () => {
  return createSelector(
    getAllChainProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (products, productCategoryId) =>
      products.filter(
        (product): boolean =>
          !!productCategoryId &&
          product.productCategoryId === productCategoryId,
      ),
  );
};

// GROUP PRODUCTS

const groupProductListSelector = createSelector(
  getProductsState,
  (state: ProductsState) => state.groupProducts,
);
export const getAllGroupProducts = groupProductsAdapter.getSelectors(
  groupProductListSelector,
).selectAll;
export const getAllGroupProductIds = groupProductsAdapter.getSelectors(
  groupProductListSelector,
).selectIds;
export const getAllGroupProductCount = groupProductsAdapter.getSelectors(
  groupProductListSelector,
).selectTotal;

export const getGroupProductById = (id: string) => {
  return createSelector(getAllGroupProducts, products =>
    products.find(product => product.id === id),
  );
};

export const getPendingGroupProductsOfSelectedCategory = () =>
  createSelector(
    getAllChainProducts,
    getAllGroupProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (chainProducts, groupProducts, productCategoryId) =>
      chainProducts.filter(chainProduct => {
        const found = groupProducts.filter(
          groupProduct => groupProduct?.parentId === chainProduct.id,
        ).length;

        return (
          !found &&
          !!productCategoryId &&
          chainProduct.productCategoryId === productCategoryId
        );
      }),
  );

export const getExtendedGroupProductsOfSelectedCategory = () =>
  createSelector(
    getAllChainProducts,
    getAllGroupProducts,
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

// UNIT PRODUCTS

const unitProductListSelector = createSelector(
  getProductsState,
  state => state.unitProducts,
);
export const getAllUnitProducts = unitProductsAdapter.getSelectors(
  unitProductListSelector,
).selectAll;
export const getAllUnitProductIds = unitProductsAdapter.getSelectors(
  unitProductListSelector,
).selectIds;
export const getAllUnitProductCount = unitProductsAdapter.getSelectors(
  unitProductListSelector,
).selectTotal;

export const getUnitProductById = (id: string) => {
  return createSelector(getAllUnitProducts, products =>
    products.find(product => product.id === id),
  );
};

export const getPendingUnitProductsOfSelectedCategory = () =>
  createSelector(
    getExtendedGroupProductsOfSelectedCategory(),
    getAllUnitProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (groupProducts, unitProducts, productCategoryId) =>
      groupProducts.filter(groupProduct => {
        const found = unitProducts.filter(
          unitProduct => unitProduct?.parentId === groupProduct.id,
        ).length;

        return (
          !found &&
          !!productCategoryId &&
          groupProduct.productCategoryId === productCategoryId
        );
      }),
  );

export const getExtendedUnitProductsOfSelectedCategory = () =>
  createSelector(
    getExtendedGroupProductsOfSelectedCategory(),
    getAllUnitProducts,
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

export const getUnitProductLaneIds = () => {
  return createSelector(getAllUnitProducts, products =>
    [...new Set(products.map(product => product.laneId || ''))].filter(
      id => !!id,
    ),
  );
};

// GENERATED UNIT PRODUCTS

const generatedProductListSelector = createSelector(
  getProductsState,
  state => state.generatedProducts,
);
export const getAllGeneratedProducts = generatedProductsAdapter.getSelectors(
  generatedProductListSelector,
).selectAll;
export const getAllGeneratedProductIds = generatedProductsAdapter.getSelectors(
  generatedProductListSelector,
).selectIds;
export const getAllGeneratedProductCount =
  generatedProductsAdapter.getSelectors(
    generatedProductListSelector,
  ).selectTotal;

export const getGeneratedProductImageById = (id: string) => {
  return createSelector(
    getAllGeneratedProducts,
    products => products.find(product => product.id === id)?.image || '',
  );
};
