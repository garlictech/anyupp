import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const init = createAction('[ProductCategories] Init');

export const upsertProductCategorys = createAction(
  '[ProductCategories] Upsert product categorys',
  props<{ productCategorys: ProductCategory[] }>(),
);

export const resetProductCategories = createAction(
  '[ProductCategories] Reset product categories',
);
