import { IProduct } from '@bgap/shared/types';
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
export const resetGeneratedProducts = createAction(
  '[ProductList] Reset generated products',
);

export const upsertChainProduct = createAction(
  '[ProductList] Upsert Chain Product',
  props<{ product: IProduct }>(),
);

export const upsertGroupProduct = createAction(
  '[ProductList] Upsert Group Product',
  props<{ product: IProduct }>(),
);

export const upsertUnitProduct = createAction(
  '[ProductList] Upsert Unit Product',
  props<{ product: IProduct }>(),
);

export const upsertGeneratedProduct = createAction(
  '[ProductList] Upsert Generated Product',
  props<{ product: IProduct }>(),
);
