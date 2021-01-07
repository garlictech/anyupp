import { get as _get } from 'lodash-es';
import { IProduct } from '../../shared/interfaces';

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
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

const chainProductListSelector: MemoizedSelector<
  object,
  IProductEntityState
> = createSelector(
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
): MemoizedSelector<object, IProduct> => {
  return createSelector(
    getAllChainProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getChainProductsOfSelectedCategory = (): MemoizedSelector<
  object,
  IProduct[]
> => {
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

const groupProductListSelector: MemoizedSelector<
  object,
  IProductEntityState
> = createSelector(
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
): MemoizedSelector<object, IProduct> => {
  return createSelector(
    getAllGroupProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getPendingGroupProductsOfSelectedCategory = (): MemoizedSelector<
  object,
  IProduct[]
> =>
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

export const getExtendedGroupProductsOfSelectedCategory = (): MemoizedSelector<
  object,
  IProduct[]
> =>
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

const unitProductListSelector: MemoizedSelector<
  object,
  IProductEntityState
> = createSelector(
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
): MemoizedSelector<object, IProduct> => {
  return createSelector(
    getAllUnitProducts,
    (products: IProduct[]): IProduct =>
      products.find((product): boolean => product._id === id)
  );
};

export const getPendingUnitProductsOfSelectedCategory = (): MemoizedSelector<
  object,
  IProduct[]
> =>
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

export const getExtendedUnitProductsOfSelectedCategory = (): MemoizedSelector<
  object,
  IProduct[]
> =>
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

export const getUnitProductLaneIds = (): MemoizedSelector<object, string[]> => {
  return createSelector(getAllUnitProducts, (products: IProduct[]): string[] =>
    [...new Set(products.map((product): string => product.laneId))].filter(
      (id): boolean => !!id
    )
  );
};

// GENERATED UNIT PRODUCTS

const generatedUnitProductListSelector: MemoizedSelector<
  object,
  IProductEntityState
> = createSelector(
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
): MemoizedSelector<object, string> => {
  return createSelector(
    getAllGeneratedUnitProducts,
    (products: IProduct[]): string =>
      products.find((product): boolean => product._id === id)?.image || ''
  );
};
