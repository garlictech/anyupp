import { NgModule } from '@angular/core';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import {
  adminUserListReducer,
  chainListReducer,
  currentUserReducer,
  dashboardReducer,
  floorMapReducer,
  groupListReducer,
  orderListReducer,
  productCategoryListReducer,
  unitListReducer,
  userListReducer,
} from './reducer';
import { productListReducer } from './reducer/product-list';
import {
  IAdminUserListState,
  IChainListState,
  ICurrentUserState,
  IDashboardState,
  IFloorMapState,
  IGroupListState,
  IOrderListState,
  IProductCategoryListState,
  IUnitListState,
  IUserListState,
} from './state';
import { IProductListState } from './state/product-list';

export interface IState {
  adminUserList: IAdminUserListState;
  chainList: IChainListState;
  currentUser: ICurrentUserState;
  dashboard: IDashboardState;
  floorMap: IFloorMapState;
  groupList: IGroupListState;
  orderList: IOrderListState;
  productCategoryList: IProductCategoryListState;
  productList: IProductListState;
  unitList: IUnitListState;
  userList: IUserListState;
}

const reducers: ActionReducerMap<IState> = {
  adminUserList: adminUserListReducer,
  chainList: chainListReducer,
  currentUser: currentUserReducer,
  dashboard: dashboardReducer,
  floorMap: floorMapReducer,
  groupList: groupListReducer,
  orderList: orderListReducer,
  productCategoryList: productCategoryListReducer,
  productList: productListReducer,
  unitList: unitListReducer,
  userList: userListReducer,
};

@NgModule({
  imports: [
    // CommonModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictStateImmutability: true,
        strictStateSerializability: true,
      },
    }),
  ],
})
export class AppStoreModule {}
