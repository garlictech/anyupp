import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { productCategoryListAdapter } from '../reducer';
import {
  IProductCategoryEntityState,
  IProductCategoryListState,
} from '../state';

const featureSelector = createFeatureSelector<IProductCategoryListState>(
  'productCategoryList'
);

const productCategoryListSelector: MemoizedSelector<
  object,
  IProductCategoryEntityState
> = createSelector(
  featureSelector,
  (state: IProductCategoryListState): IProductCategoryEntityState =>
    state.productCategories
);
export const getAllProductCategories = productCategoryListAdapter.getSelectors(
  productCategoryListSelector
).selectAll;
export const getAllProductCategoryIds = productCategoryListAdapter.getSelectors(
  productCategoryListSelector
).selectIds;
export const getAllProductCategoryCount = productCategoryListAdapter.getSelectors(
  productCategoryListSelector
).selectTotal;
