import { IProduct } from 'src/app/shared/interfaces';

import { createAction, props } from '@ngrx/store';

export const resetChainProducts = createAction('[ProductList] Reset chain products');
export const resetGroupProducts = createAction('[ProductList] Reset group products');
export const resetUnitProducts = createAction('[ProductList] Reset unit products');
export const resetGeneratedUnitProducts = createAction('[ProductList] Reset generated unit products');
export const setAllChainProducts = createAction(
  '[ProductList] Set all chain products',
  props<{ products: IProduct[] }>()
);
export const setAllGroupProducts = createAction(
  '[ProductList] Set all group products',
  props<{ products: IProduct[] }>()
);
export const setAllUnitProducts = createAction(
  '[ProductList] Set all unit products',
  props<{ products: IProduct[] }>()
);
export const setAllGeneratedUnitProducts = createAction(
  '[ProductList] Set all generated unit products',
  props<{ products: IProduct[] }>()
);
