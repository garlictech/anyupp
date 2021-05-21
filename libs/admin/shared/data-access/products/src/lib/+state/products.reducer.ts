import { IProduct } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import * as ProductsActions from './products.actions';

export const PRODUCTS_FEATURE_KEY = 'products';

export type IProductEntityState = EntityState<IProduct>;

export interface IProductsState {
  chainProducts: IProductEntityState;
  groupProducts: IProductEntityState;
  unitProducts: IProductEntityState;
  generatedProducts: IProductEntityState;
}

export interface ProductsPartialState {
  readonly [PRODUCTS_FEATURE_KEY]: IProductsState;
}

//
// CHAIN
//

export const chainProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>();

export const initialChainProductState: IProductEntityState = chainProductsAdapter.getInitialState(
  {},
);

const chainProductsReducer = createReducer(
  initialChainProductState,
  on(ProductsActions.upsertChainProduct, (state, { product }) =>
    chainProductsAdapter.upsertOne(product, state),
  ),
  on(ProductsActions.resetChainProducts, state => chainProductsAdapter.removeAll(state)),
);

//
// GROUP
//

export const groupProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>();

export const initialGroupProductState: IProductEntityState = groupProductsAdapter.getInitialState(
  {},
);

const groupProductsReducer = createReducer(
  initialGroupProductState,
  on(ProductsActions.upsertGroupProduct, (state, { product }) =>
    groupProductsAdapter.upsertOne(product, state),
  ),
  on(ProductsActions.resetGroupProducts, state => groupProductsAdapter.removeAll(state)),
);

//
// UNIT
//

export const unitProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>();

export const initialUnitProductState: IProductEntityState = unitProductsAdapter.getInitialState(
  {},
);

const unitProductsReducer = createReducer(
  initialUnitProductState,
  on(ProductsActions.upsertUnitProduct, (state, { product }) =>
    unitProductsAdapter.upsertOne(product, state),
  ),
  on(ProductsActions.resetUnitProducts, state => unitProductsAdapter.removeAll(state)),
);

//
// GENERATED
//

export const generatedProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>();

export const initialGeneratedProductState: IProductEntityState = generatedProductsAdapter.getInitialState(
  {},
);

const generatedProductsReducer = createReducer(
  initialGeneratedProductState,
  on(ProductsActions.upsertGeneratedProduct, (state, { product }) =>
    generatedProductsAdapter.upsertOne(product, state),
  ),
  on(ProductsActions.resetGeneratedProducts, state => generatedProductsAdapter.removeAll(state)),
);

const reducerMap: ActionReducerMap<IProductsState> = {
  chainProducts: chainProductsReducer,
  groupProducts: groupProductsReducer,
  unitProducts: unitProductsReducer,
  generatedProducts: generatedProductsReducer,
};

const combinedReducer: ActionReducer<IProductsState> = combineReducers(
  reducerMap,
);

export function productsReducer(
  state: IProductsState | undefined,
  action: Action,
): IProductsState {
  return combinedReducer(state, action);
}
