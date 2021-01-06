import { IProductCategory } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetProductCategories = createAction('[ProductCategoryList] Reset product categories');
export const setAllProductCategories = createAction(
  '[ProductCategoryList] Set all product categories',
  props<{ productCategories: IProductCategory[] }>()
);
