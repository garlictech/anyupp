import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from './@theme/components/admin-layout/admin-layout.component';
import { MENU_ROLES } from './shared/const';
import { AuthGuard } from './shared/services/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: (): any => import('./pages/dashboard/dashboard.module').then((m): any => m.DashboardModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.DASHBOARD,
        },
      },
      {
        path: 'products',
        loadChildren: (): any =>
          import('./pages/product-list/product-list.module').then((m): any => m.ProductListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.PRODUCTS,
        },
      },
      {
        path: 'product-categories',
        loadChildren: (): any =>
          import('./pages/product-category-list/product-category-list.module').then(
            (m): any => m.ProductCategoryListModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.PRODUCT_CATEGORIES,
        },
      },
      {
        path: 'groups',
        loadChildren: (): any => import('./pages/group-list/group-list.module').then((m): any => m.GroupListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.GROUPS,
        },
      },
      {
        path: 'units',
        loadChildren: (): any => import('./pages/unit-list/unit-list.module').then((m): any => m.UnitListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.UNITS,
        },
      },
      {
        path: 'chains',
        loadChildren: (): any => import('./pages/chain-list/chain-list.module').then((m): any => m.ChainListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.CHAINS,
        },
      },
      {
        path: 'users',
        loadChildren: (): any => import('./pages/user-list/user-list.module').then((m): any => m.UserListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.USERS,
        },
      },
      {
        path: 'admins',
        loadChildren: (): any =>
          import('./pages/admin-user-list/admin-user-list.module').then((m): any => m.AdminUserListModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.ADMINS,
        },
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadChildren: (): any => import('./pages/auth/login/login.module').then((m): any => m.LoginModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
