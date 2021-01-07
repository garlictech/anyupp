import { IProduct } from 'src/app/shared/interfaces';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { productListActions } from '../actions';
import { IProductListState } from '../state';

// CHAIN PRODUCTS

export const chainProductListAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});
export const chainProductListInitialState: EntityState<IProduct> = chainProductListAdapter.getInitialState();

const baseChainProductListReducer = createReducer(
  chainProductListInitialState,
  on(
    productListActions.setAllChainProducts,
    (state, { products }): EntityState<IProduct> =>
      chainProductListAdapter.setAll(products, state)
  ),
  on(
    productListActions.resetChainProducts,
    (state): EntityState<IProduct> => chainProductListAdapter.removeAll(state)
  )
);

// GROUP PRODUCTS

export const groupProductListAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});
export const groupProductListInitialState: EntityState<IProduct> = groupProductListAdapter.getInitialState();

const baseGroupProductListReducer = createReducer(
  groupProductListInitialState,
  on(
    productListActions.setAllGroupProducts,
    (state, { products }): EntityState<IProduct> =>
      groupProductListAdapter.setAll(products, state)
  ),
  on(
    productListActions.resetGroupProducts,
    (state): EntityState<IProduct> => groupProductListAdapter.removeAll(state)
  )
);

// UNIT PRODUCTS

export const unitProductListAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});
export const unitProductListInitialState: EntityState<IProduct> = unitProductListAdapter.getInitialState();

const baseUnitProductListReducer = createReducer(
  unitProductListInitialState,
  on(
    productListActions.setAllUnitProducts,
    (state, { products }): EntityState<IProduct> =>
      unitProductListAdapter.setAll(products, state)
  ),
  on(
    productListActions.resetUnitProducts,
    (state): EntityState<IProduct> => unitProductListAdapter.removeAll(state)
  )
);

// GENERATED UNIT PRODUCTS

export const generatedUnitProductListAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});
export const generatedUnitProductListInitialState: EntityState<IProduct> = generatedUnitProductListAdapter.getInitialState();

const baseGeneratedUnitProductListReducer = createReducer(
  generatedUnitProductListInitialState,
  on(
    productListActions.setAllGeneratedUnitProducts,
    (state, { products }): EntityState<IProduct> =>
      generatedUnitProductListAdapter.setAll(products, state)
  ),
  on(
    productListActions.resetGeneratedUnitProducts,
    (state): EntityState<IProduct> =>
      generatedUnitProductListAdapter.removeAll(state)
  )
);

//

const reducerMap: ActionReducerMap<IProductListState> = {
  chainProducts: baseChainProductListReducer,
  groupProducts: baseGroupProductListReducer,
  unitProducts: baseUnitProductListReducer,
  generatedUnitProducts: baseGeneratedUnitProductListReducer,
};

const reducer: ActionReducer<IProductListState> = combineReducers(reducerMap);

export function productListReducer(state: any, action: any): IProductListState {
  return reducer(state, action);
}
