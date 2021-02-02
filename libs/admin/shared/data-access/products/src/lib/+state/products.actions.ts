import { createAction, props } from '@ngrx/store';

export const init = createAction('[Products Page] Init');

import { IProduct } from '@bgap/shared/types';

export const resetChainProducts = createAction(
  '[ProductList] Reset chain products'
);
export const resetGroupProducts = createAction(
  '[ProductList] Reset group products'
);
export const resetUnitProducts = createAction(
  '[ProductList] Reset unit products'
);
export const resetGeneratedUnitProducts = createAction(
  '[ProductList] Reset generated unit products'
);
export const loadChainProductsSuccess = createAction(
  '[ProductList] Load Chain Products Success',
  props<{ products: IProduct[] }>()
);
export const loadGroupProductsSuccess = createAction(
  '[ProductList] Load Group Products Success',
  props<{ products: IProduct[] }>()
);
export const loadUnitProductsSuccess = createAction(
  '[ProductList] Load Unit Products Success',
  props<{ products: IProduct[] }>()
);
export const loadGeneratedUnitProductsSuccess = createAction(
  '[ProductList] Load Generated Unit Products Success',
  props<{ products: IProduct[] }>()
);

export const loadChainProductsFailure = createAction(
  '[Products] Load Chain Products Failure',
  props<{ error: any }>()
);

export const loadGroupProductsFailure = createAction(
  '[Products] Load Group Products Failure',
  props<{ error: any }>()
);
export const loadUnitProductsFailure = createAction(
  '[Products] Load Unit Products Failure',
  props<{ error: any }>()
);

export const loadGeneratedUnitProductsFailure = createAction(
  '[Products] Load Generated Unit Products Failure',
  props<{ error: any }>()
);
