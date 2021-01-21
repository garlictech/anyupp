import { createAction, props } from '@ngrx/store';
import { IProductCategory } from '@bgap/shared/types/interfaces';

export const resetProductCategories = createAction(
  '[ProductCategoryList] Reset product categories'
);
export const setAllProductCategories = createAction(
  '[ProductCategoryList] Set all product categories',
  props<{ productCategories: IProductCategory[] }>()
);
