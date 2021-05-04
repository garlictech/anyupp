import { IProductCategory } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductCategories] Init');

export const upsertProductCategory = createAction(
  '[ProductCategories] Upsert product category',
  props<{ productCategory: IProductCategory }>(),
);

export const resetProductCategories = createAction(
  '[ProductCategories] Reset product categories',
);
