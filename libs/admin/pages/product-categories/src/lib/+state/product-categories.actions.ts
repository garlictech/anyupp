import { createAction, props } from '@ngrx/store';
import { ProductCategoriesEntity } from './product-categories.models';

export const init = createAction('[ProductCategories Page] Init');

export const loadProductCategoriesSuccess = createAction(
  '[ProductCategories/API] Load ProductCategories Success',
  props<{ productCategories: ProductCategoriesEntity[] }>()
);

export const loadProductCategoriesFailure = createAction(
  '[ProductCategories/API] Load ProductCategories Failure',
  props<{ error: any }>()
);
