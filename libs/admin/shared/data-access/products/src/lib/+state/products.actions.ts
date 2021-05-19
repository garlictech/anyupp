import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const resetChainProducts = createAction(
  '[ProductList] Reset chain products',
);
export const resetGroupProducts = createAction(
  '[ProductList] Reset group products',
);
export const resetUnitProducts = createAction(
  '[ProductList] Reset unit products',
);
export const resetGeneratedUnitProducts = createAction(
  '[ProductList] Reset generated unit products',
);

export const upsertChainsProducts = createAction(
  '[ProductList] Upsert Chain Product',
  props<{ products: CrudApi.ChainProduct[] }>(),
);

export const upsertGroupProducts = createAction(
  '[ProductList] Upsert Group Products',
  props<{ products: CrudApi.GroupProduct[] }>(),
);

export const upsertUnitProducts = createAction(
  '[ProductList] Upsert Unit Products',
  props<{ products: CrudApi.UnitProduct[] }>(),
);

export const upsertGeneratedProducts = createAction(
  '[ProductList] Upsert Generated Products',
  props<{ products: Product[] }>(),
);
