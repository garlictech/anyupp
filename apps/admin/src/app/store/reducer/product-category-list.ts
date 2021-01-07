import { IProductCategory } from '../../shared/interfaces';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { productCategoryListActions } from '../actions';
import { IProductCategoryListState } from '../state';

export const productCategoryListAdapter: EntityAdapter<IProductCategory> = createEntityAdapter<
  IProductCategory
>({
  selectId: (item: IProductCategory): string => item._id,
});
export const productCategoryListInitialState: EntityState<IProductCategory> = productCategoryListAdapter.getInitialState();

const baseProductCategoryListReducer = createReducer(
  productCategoryListInitialState,
  on(
    productCategoryListActions.setAllProductCategories,
    (state, { productCategories }): EntityState<IProductCategory> =>
      productCategoryListAdapter.setAll(productCategories, state)
  ),
  on(
    productCategoryListActions.resetProductCategories,
    (state): EntityState<IProductCategory> =>
      productCategoryListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IProductCategoryListState> = {
  productCategories: baseProductCategoryListReducer,
};

const reducer: ActionReducer<IProductCategoryListState> = combineReducers(
  reducerMap
);

export function productCategoryListReducer(
  state: any,
  action: any
): IProductCategoryListState {
  return reducer(state, action);
}
