import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IProduct } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  chainProductsAdapter,
  generatedUnitProductsAdapter,
  groupProductsAdapter,
  IProductEntityState,
  IProductsState,
  PRODUCTS_FEATURE_KEY,
  unitProductsAdapter,
} from './products.reducer';

// Lookup the 'Products' feature state managed by NgRx
export const getProductsState = createFeatureSelector<IProductsState>(
  PRODUCTS_FEATURE_KEY,
);

// CHAIN PRODUCTS

const chainProductListSelector = createSelector(
  getProductsState,
  (state: IProductsState): IProductEntityState => state.chainProducts,
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
  return createSelector(getAllChainProducts, (products: IProduct[]):
    | IProduct
    | undefined => products.find(product => product.id === id));
};

export const getChainProductsOfSelectedCategory = () => {
  return createSelector(
    getAllChainProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (
      products: IProduct[],
      productCategoryId: string | null | undefined,
    ): IProduct[] =>
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
  (state: IProductsState): IProductEntityState => state.groupProducts,
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
  return createSelector(getAllGroupProducts, (products: IProduct[]):
    | IProduct
    | undefined => products.find(product => product.id === id));
};

export const getPendingGroupProductsOfSelectedCategory = () =>
  createSelector(
    getAllChainProducts,
    getAllGroupProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (
      chainProducts: IProduct[],
      groupProducts: IProduct[],
      productCategoryId: string | null | undefined,
    ): IProduct[] =>
      chainProducts.filter((chainProduct: IProduct): boolean => {
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
    (
      chainProducts: IProduct[],
      groupProducts: IProduct[],
      productCategoryId: string | null | undefined,
    ): IProduct[] =>
      groupProducts
        .map(groupProduct => {
          const chainProduct = chainProducts.find(
            p => p.id === groupProduct.parentId,
          );

          return Object.assign({}, chainProduct || {}, groupProduct);
        })
        .filter(
          extendedGroupProduct =>
            !!productCategoryId &&
            extendedGroupProduct.productCategoryId === productCategoryId,
        ),
  );

// UNIT PRODUCTS

const unitProductListSelector = createSelector(
  getProductsState,
  (state: IProductsState): IProductEntityState => state.unitProducts,
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
  return createSelector(getAllUnitProducts, (products: IProduct[]):
    | IProduct
    | undefined => products.find(product => product.id === id));
};

export const getPendingUnitProductsOfSelectedCategory = () =>
  createSelector(
    getExtendedGroupProductsOfSelectedCategory(),
    getAllUnitProducts,
    loggedUserSelectors.getSelectedProductCategoryId,
    (
      groupProducts: IProduct[],
      unitProducts: IProduct[],
      productCategoryId: string | null | undefined,
    ): IProduct[] =>
      groupProducts.filter((groupProduct: IProduct): boolean => {
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
    (
      groupProducts: IProduct[],
      unitProducts: IProduct[],
      productCategoryId: string | null | undefined,
    ): IProduct[] =>
      unitProducts
        .map(unitProduct => {
          const groupProduct = groupProducts.find(
            p => p.id === unitProduct.parentId,
          );

          return Object.assign({}, groupProduct || {}, unitProduct);
        })
        .filter(
          extendedGroupProduct =>
            !!productCategoryId &&
            extendedGroupProduct.productCategoryId === productCategoryId,
        ),
  );

export const getUnitProductLaneIds = () => {
  return createSelector(getAllUnitProducts, (products: IProduct[]): string[] =>
    [...new Set(products.map(product => product.laneId || ''))].filter(
      id => !!id,
    ),
  );
};

// GENERATED UNIT PRODUCTS

const generatedUnitProductListSelector = createSelector(
  getProductsState,
  (state: IProductsState): IProductEntityState => state.generatedUnitProducts,
);
export const getAllGeneratedUnitProducts = generatedUnitProductsAdapter.getSelectors(
  generatedUnitProductListSelector,
).selectAll;
export const getAllGeneratedUnitProductIds = generatedUnitProductsAdapter.getSelectors(
  generatedUnitProductListSelector,
).selectIds;
export const getAllGeneratedUnitProductCount = generatedUnitProductsAdapter.getSelectors(
  generatedUnitProductListSelector,
).selectTotal;

export const getGeneratedProductImageById = (id: string) => {
  return createSelector(
    getAllGeneratedUnitProducts,
    (products: IProduct[]): string =>
      products.find(product => product.id === id)?.image || '',
  );
};
