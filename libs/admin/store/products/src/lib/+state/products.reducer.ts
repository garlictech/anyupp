import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';
//import {Product} from '@bgap/shared/types';

import * as ProductsActions from './products.actions';

export const PRODUCTS_FEATURE_KEY = 'products';

export interface ProductsState {
  chainProducts: EntityState<CrudApi.ChainProduct>;
  groupProducts: EntityState<CrudApi.GroupProduct>;
  unitProducts: EntityState<CrudApi.UnitProduct>;
  generatedProducts: EntityState<CrudApi.GeneratedProduct>;
}

export interface ExtendedGroupProduct
  extends CrudApi.ChainProduct,
    CrudApi.GroupProduct {}
export interface ExtendedUnitProduct
  extends ExtendedGroupProduct,
    CrudApi.UnitProduct {}

//
// CHAIN
//

export const chainProductsAdapter: EntityAdapter<CrudApi.ChainProduct> =
  createEntityAdapter<CrudApi.ChainProduct>();

export const initialChainProductState = chainProductsAdapter.getInitialState(
  {},
);

const chainProductsReducer = createReducer(
  initialChainProductState,
  on(ProductsActions.upsertChainsProducts, (state, { products }) =>
    chainProductsAdapter.upsertMany(products, state),
  ),
  on(ProductsActions.resetChainProducts, state =>
    chainProductsAdapter.removeAll(state),
  ),
);

//
// GROUP
//

export const groupProductsAdapter: EntityAdapter<CrudApi.GroupProduct> =
  createEntityAdapter<CrudApi.GroupProduct>();

export const initialGroupProductState = groupProductsAdapter.getInitialState(
  {},
);

const groupProductsReducer = createReducer(
  initialGroupProductState,
  on(ProductsActions.upsertGroupProducts, (state, { products }) =>
    groupProductsAdapter.upsertMany(products, state),
  ),
  on(ProductsActions.resetGroupProducts, state =>
    groupProductsAdapter.removeAll(state),
  ),
);

//
// UNIT
//

export const unitProductsAdapter: EntityAdapter<CrudApi.UnitProduct> =
  createEntityAdapter<CrudApi.UnitProduct>();

export const initialUnitProductState = unitProductsAdapter.getInitialState({});

const unitProductsReducer = createReducer(
  initialUnitProductState,
  on(ProductsActions.upsertUnitProducts, (state, { products }) =>
    unitProductsAdapter.upsertMany(products, state),
  ),
  on(ProductsActions.resetUnitProducts, state =>
    unitProductsAdapter.removeAll(state),
  ),
);

//
// GENERATED
//

export const generatedProductsAdapter: EntityAdapter<CrudApi.GeneratedProduct> =
  createEntityAdapter<CrudApi.GeneratedProduct>();

export const initialGeneratedProductState =
  generatedProductsAdapter.getInitialState({});

const generatedProductsReducer = createReducer(
  initialGeneratedProductState,
  on(ProductsActions.upsertGeneratedProducts, (state, { products }) =>
    generatedProductsAdapter.upsertMany(products, state),
  ),
  on(ProductsActions.resetGeneratedProducts, state =>
    generatedProductsAdapter.removeAll(state),
  ),
);

const reducerMap: ActionReducerMap<ProductsState> = {
  chainProducts: chainProductsReducer,
  groupProducts: groupProductsReducer,
  unitProducts: unitProductsReducer,
  generatedProducts: generatedProductsReducer,
};

const combinedReducer: ActionReducer<ProductsState> =
  combineReducers(reducerMap);

export function productsReducer(
  state: ProductsState | undefined,
  action: Action,
): ProductsState {
  return combinedReducer(state, action);
}
