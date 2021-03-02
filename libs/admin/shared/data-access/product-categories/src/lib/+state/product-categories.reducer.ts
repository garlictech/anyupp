import { IProductCategory } from '@bgap/shared/types';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductCategoriesActions from './product-categories.actions';

export const PRODUCT_CATEGORIES_FEATURE_KEY = 'productCategories';

export interface IProductCategoriesState extends EntityState<IProductCategory> {
  selectedId?: string | number; // which ProductCategories record has been selected
  loaded: boolean; // has the ProductCategories list been loaded
  error?: string | null; // last known error (if any)
}

export interface ProductCategoriesPartialState {
  readonly [PRODUCT_CATEGORIES_FEATURE_KEY]: IProductCategoriesState;
}

export const productCategoriesAdapter: EntityAdapter<IProductCategory> = createEntityAdapter<
  IProductCategory
>();

export const initialState: IProductCategoriesState = productCategoriesAdapter.getInitialState(
  {
    // set initial required properties
    loaded: false,
  },
);

const reducer = createReducer(
  initialState,
  on(ProductCategoriesActions.init, state => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(
    ProductCategoriesActions.loadProductCategoriesSuccess,
    (state, { productCategories }) =>
      productCategoriesAdapter.setAll(productCategories, {
        ...state,
        loaded: true,
      }),
  ),
  on(ProductCategoriesActions.resetProductCategories, state =>
    productCategoriesAdapter.removeAll(state),
  ),
);

export function productCategoriesReducer(
  state: IProductCategoriesState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
