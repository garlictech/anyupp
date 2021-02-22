import { IProductCategory } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductCategories Page] Init');

export const loadProductCategoriesSuccess = createAction(
  '[ProductCategories] Load ProductCategories Success',
  props<{ productCategories: IProductCategory[] }>()
);

export const resetProductCategories = createAction(
  '[ProductCategoryList] Reset product categories'
);
