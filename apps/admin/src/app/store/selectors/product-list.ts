import { get as _get } from 'lodash-es';
import { IProduct } from '@bgap/shared/types/interfaces';

import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import {
  chainProductListAdapter,
  generatedUnitProductListAdapter,
  groupProductListAdapter,
  unitProductListAdapter,
} from '../reducer';
import { IProductEntityState, IProductListState } from '../state';
import { getSelectedProductCategoryId } from './current-user';

const featureSelector = createFeatureSelector<IProductListState>('productList');

// CHAIN PRODUCTS

const chainProductListSelector = createSelector(
  featureSelector,
  (state: IProductListState): IProductEntityState => state.chainProducts
);
export const getAllChainProducts = chainProductListAdapter.getSelectors(
  chainProductListSelector
).selectAll;
export const getAllChainProductIds = chainProductListAdapter.getSelectors(
  chainProductListSelector
).selectIds;
export const getAllChainProductCount = chainProductListAdapter.getSelectors(
  chainProductListSelector
).selectTotal;

export const getChainProductById = (
  id: string
) => {
  return createSelector(
    getAllChainProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getChainProductsOfSelectedCategory = () => {
  return createSelector(
    getAllChainProducts,
    getSelectedProductCategoryId,
    (products: IProduct[], productCategoryId: string): IProduct[] =>
      products.filter(
        (product): boolean =>
          !!productCategoryId && product.productCategoryId === productCategoryId
      )
  );
};

// GROUP PRODUCTS

const groupProductListSelector = createSelector(
  featureSelector,
  (state: IProductListState): IProductEntityState => state.groupProducts
);
export const getAllGroupProducts = groupProductListAdapter.getSelectors(
  groupProductListSelector
).selectAll;
export const getAllGroupProductIds = groupProductListAdapter.getSelectors(
  groupProductListSelector
).selectIds;
export const getAllGroupProductCount = groupProductListAdapter.getSelectors(
  groupProductListSelector
).selectTotal;

export const getGroupProductById = (
  id: string
) => {
  return createSelector(
    getAllGroupProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getPendingGroupProductsOfSelectedCategory = () =>
  createSelector(
    getAllChainProducts,
    getAllGroupProducts,
    getSelectedProductCategoryId,
    (chainProducts, groupProducts, productCategoryId): IProduct[] =>
      chainProducts.filter((chainProduct: IProduct): boolean => {
        const found = groupProducts.filter(
          (groupProduct: IProduct): boolean =>
            _get(groupProduct, 'extends', '').indexOf(chainProduct._id) > -1
        ).length;

        return (
          !found &&
          !!productCategoryId &&
          chainProduct.productCategoryId === productCategoryId
        );
      })
  );

export const getExtendedGroupProductsOfSelectedCategory = () =>
  createSelector(
    getAllChainProducts,
    getAllGroupProducts,
    getSelectedProductCategoryId,
    (chainProducts, groupProducts, productCategoryId): IProduct[] => {
      return groupProducts
        .map(
          (groupProduct: IProduct): IProduct => {
            const chainProduct = chainProducts.find(
              (p: IProduct): boolean =>
                p._id === _get(groupProduct, 'extends', '').split('/').pop()
            );

            return Object.assign({}, chainProduct, groupProduct);
          }
        )
        .filter(
          (extendedGroupProduct: IProduct): boolean =>
            !!productCategoryId &&
            extendedGroupProduct.productCategoryId === productCategoryId
        );
    }
  );

// UNIT PRODUCTS

const unitProductListSelector = createSelector(
  featureSelector,
  (state: IProductListState): IProductEntityState => state.unitProducts
);
export const getAllUnitProducts = unitProductListAdapter.getSelectors(
  unitProductListSelector
).selectAll;
export const getAllUnitProductIds = unitProductListAdapter.getSelectors(
  unitProductListSelector
).selectIds;
export const getAllUnitProductCount = unitProductListAdapter.getSelectors(
  unitProductListSelector
).selectTotal;

export const getUnitProductById = (
  id: string
) => {
  return createSelector(
    getAllUnitProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getPendingUnitProductsOfSelectedCategory = () =>
  createSelector(
    getExtendedGroupProductsOfSelectedCategory(),
    getAllUnitProducts,
    getSelectedProductCategoryId,
    (groupProducts, unitProducts, productCategoryId): IProduct[] =>
      groupProducts.filter((groupProduct: IProduct): boolean => {
        const found = unitProducts.filter(
          (unitProduct: IProduct): boolean =>
            _get(unitProduct, 'extends', '').indexOf(groupProduct._id) > -1
        ).length;

        return (
          !found &&
          !!productCategoryId &&
          groupProduct.productCategoryId === productCategoryId
        );
      })
  );

export const getExtendedUnitProductsOfSelectedCategory = () =>
  createSelector(
    getExtendedGroupProductsOfSelectedCategory(),
    getAllUnitProducts,
    getSelectedProductCategoryId,
    (groupProducts, unitProducts, productCategoryId): IProduct[] => {
      return unitProducts
        .map(
          (unitProduct: IProduct): IProduct => {
            const groupProduct = groupProducts.find(
              (p: IProduct): boolean =>
                p._id === _get(unitProduct, 'extends', '').split('/').pop()
            );

            return Object.assign({}, groupProduct || {}, unitProduct);
          }
        )
        .filter(
          (extendedUnitProduct: IProduct): boolean =>
            !!productCategoryId &&
            extendedUnitProduct.productCategoryId === productCategoryId
        );
    }
  );

export const getUnitProductLaneIds = () => {
  return createSelector(getAllUnitProducts, (products: IProduct[]): string[] =>
    [...new Set(products.map((product): string => product.laneId))].filter(
      (id): boolean => !!id
    )
  );
};

// GENERATED UNIT PRODUCTS

const generatedUnitProductListSelector = createSelector(
  featureSelector,
  (state: IProductListState): IProductEntityState => state.generatedUnitProducts
);
export const getAllGeneratedUnitProducts = generatedUnitProductListAdapter.getSelectors(
  generatedUnitProductListSelector
).selectAll;
export const getAllGeneratedUnitProductIds = generatedUnitProductListAdapter.getSelectors(
  generatedUnitProductListSelector
).selectIds;
export const getAllGeneratedUnitProductCount = generatedUnitProductListAdapter.getSelectors(
  generatedUnitProductListSelector
).selectTotal;

export const getGeneratedProductImageById = (
  id: string
) => {
  return createSelector(
    getAllGeneratedUnitProducts,
    (products: IProduct[]): string =>
      products.find((product): boolean => product._id === id)?.image || ''
  );
};
