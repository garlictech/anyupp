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

export interface IProductEntityState extends EntityState<IProduct> {
  selectedId?: string | number; // which Products record has been selected
  loaded: boolean; // has the Products list been loaded
  error?: string | null; // last known error (if any)
}

export interface IProductsState {
  chainProducts: IProductEntityState;
  groupProducts: IProductEntityState;
  unitProducts: IProductEntityState;
  generatedUnitProducts: IProductEntityState;
}

export interface ProductsPartialState {
  readonly [PRODUCTS_FEATURE_KEY]: IProductsState;
}

//
// CHAIN
//

export const chainProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});

export const initialChainProductState: IProductEntityState = chainProductsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const chainProductsReducer = createReducer(
  initialChainProductState,
  on(ProductsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ProductsActions.loadChainProductsSuccess, (state, { products }) =>
    chainProductsAdapter.setAll(products, { ...state, loaded: true })
  ),
  on(ProductsActions.loadChainProductsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

//
// GROUP
//

export const groupProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});

export const initialGroupProductState: IProductEntityState = groupProductsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const groupProductsReducer = createReducer(
  initialGroupProductState,
  on(ProductsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ProductsActions.loadGroupProductsSuccess, (state, { products }) =>
    chainProductsAdapter.setAll(products, { ...state, loaded: true })
  ),
  on(ProductsActions.loadGroupProductsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

//
// UNIT
//

export const unitProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});

export const initialUnitProductState: IProductEntityState = unitProductsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const unitProductsReducer = createReducer(
  initialUnitProductState,
  on(ProductsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ProductsActions.loadUnitProductsSuccess, (state, { products }) =>
    chainProductsAdapter.setAll(products, { ...state, loaded: true })
  ),
  on(ProductsActions.loadUnitProductsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

//
// UNIT
//

export const generatedUnitProductsAdapter: EntityAdapter<IProduct> = createEntityAdapter<
  IProduct
>({
  selectId: (item: IProduct): string => item._id,
});

export const initialGeneratedUnitProductState: IProductEntityState = generatedUnitProductsAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  }
);

const generatedUnitProductsReducer = createReducer(
  initialGeneratedUnitProductState,
  on(ProductsActions.init, state => ({ ...state, loaded: false, error: null })),
  on(ProductsActions.loadGeneratedUnitProductsSuccess, (state, { products }) =>
    chainProductsAdapter.setAll(products, { ...state, loaded: true })
  ),
  on(ProductsActions.loadGeneratedUnitProductsFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

const reducerMap: ActionReducerMap<IProductsState> = {
  chainProducts: chainProductsReducer,
  groupProducts: groupProductsReducer,
  unitProducts: unitProductsReducer,
  generatedUnitProducts: generatedUnitProductsReducer,
};

const combinedReducer: ActionReducer<IProductsState> = combineReducers(
  reducerMap
);

export function productsReducer(
  state: IProductsState | undefined,
  action: Action
): IProductsState {
  return combinedReducer(state, action);
}
