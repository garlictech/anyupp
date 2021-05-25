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
  generatedUnitProducts: EntityState<CrudApi.GeneratedProduct>;
}

export interface ProductsPartialState {
  readonly [PRODUCTS_FEATURE_KEY]: ProductsState;
}

//
// CHAIN
//

export const chainProductsAdapter: EntityAdapter<CrudApi.ChainProduct> = createEntityAdapter<
  CrudApi.ChainProduct
>();

export const initialChainProductState = chainProductsAdapter.getInitialState(
  {},
);

const chainProductsReducer = createReducer(
  initialChainProductState,
  on(ProductsActions.upsertChainsProducts, (state, { products }) =>
    chainProductsAdapter.upsertMany(products, state),
  ),
);

//
// GROUP
//

export const groupProductsAdapter: EntityAdapter<CrudApi.GroupProduct> = createEntityAdapter<
  CrudApi.GroupProduct
>();

export const initialGroupProductState = groupProductsAdapter.getInitialState(
  {},
);

const groupProductsReducer = createReducer(
  initialGroupProductState,
  on(ProductsActions.upsertGroupProducts, (state, { products }) =>
    groupProductsAdapter.upsertMany(products, state),
  ),
);

//
// UNIT
//

export const unitProductsAdapter: EntityAdapter<CrudApi.UnitProduct> = createEntityAdapter<
  CrudApi.UnitProduct
>();

export const initialUnitProductState = unitProductsAdapter.getInitialState({});

const unitProductsReducer = createReducer(
  initialUnitProductState,
  on(ProductsActions.upsertUnitProducts, (state, { products }) =>
    unitProductsAdapter.upsertMany(products, state),
  ),
);

//
// UNIT
//

export const generatedUnitProductsAdapter: EntityAdapter<CrudApi.GeneratedProduct> = createEntityAdapter<
  CrudApi.GeneratedProduct
>();

export const initialGeneratedUnitProductState = generatedUnitProductsAdapter.getInitialState(
  {},
);

const generatedUnitProductsReducer = createReducer(
  initialGeneratedUnitProductState,
  on(ProductsActions.upsertGeneratedProducts, (state, { products }) =>
    generatedUnitProductsAdapter.upsertMany(products, state),
  ),
);

const reducerMap: ActionReducerMap<ProductsState> = {
  chainProducts: chainProductsReducer,
  groupProducts: groupProductsReducer,
  unitProducts: unitProductsReducer,
  generatedUnitProducts: generatedUnitProductsReducer,
};

const combinedReducer: ActionReducer<ProductsState> = combineReducers(
  reducerMap,
);

export function productsReducer(
  state: ProductsState | undefined,
  action: Action,
): ProductsState {
  return combinedReducer(state, action);
}
