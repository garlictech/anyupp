import { createAction, props } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

export const init = createAction('[ProductCategories] Init');

export const upsertProductCategories = createAction(
  '[ProductCategories] Upsert product categorys',
  props<{ productCategories: CrudApi.ProductCategory[] }>(),
);

export const resetProductCategories = createAction(
  '[ProductCategories] Reset product categories',
);
