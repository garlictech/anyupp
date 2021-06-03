import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[ProductCategories] Init');

export const upsertProductCategorys = createAction(
  '[ProductCategories] Upsert product categorys',
  props<{ productCategorys: CrudApi.ProductCategory[] }>(),
);

export const resetProductCategories = createAction(
  '[ProductCategories] Reset product categories',
);
