import { AdminLayoutComponent } from 'libs/admin/ui/theme/src/lib/components/admin-layout/admin-layout.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@bgap/admin/shared/auth';
import { MENU_ROLES } from '@bgap/admin/shared/utils';

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
        loadChildren: () =>
          import('@bgap/admin/pages/dashboard').then(
            (m) => m.AdminPagesDashboardModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.DASHBOARD,
        },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@bgap/admin/pages/products').then(
            (m) => m.AdminPagesProductsModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.PRODUCTS,
        },
      },
      {
        path: 'product-categories',
        loadChildren: () =>
          import(
            '@bgap/admin/pages/product-categories'
          ).then((m) => m.AdminPagesProductCategoriesModule),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.PRODUCT_CATEGORIES,
        },
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('@bgap/admin/pages/groups').then(
            (m) => m.AdminPagesGroupsModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.GROUPS,
        },
      },
      {
        path: 'units',
        loadChildren: () =>
          import('@bgap/admin/pages/units').then(
            (m) => m.AdminPagesUnitsModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.UNITS,
        },
      },
      {
        path: 'chains',
        loadChildren: () =>
          import('@bgap/admin/pages/chains').then(
            (m) => m.AdminPagesChainsModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.CHAINS,
        },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('@bgap/admin/pages/users').then(
            (m) => m.AdminPagesUsersModule
          ),
        canActivateChild: [AuthGuard],
        data: {
          roles: MENU_ROLES.USERS,
        },
      },
      {
        path: 'admins',
        loadChildren: () =>
          import('@bgap/admin/pages/admin-users').then(
            (m) => m.AdminPagesAdminUsersModule
          ),
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
        loadChildren: () =>
          import('@bgap/admin/pages/auth').then(
            (m) => m.AdminPagesAuthModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
