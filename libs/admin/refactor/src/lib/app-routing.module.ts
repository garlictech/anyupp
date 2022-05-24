import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { AuthGuard } from './shared/data-access/auth';
import { MENU_ROLES } from './shared/utils';
import { AdminLayoutComponent } from './ui/theme';

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
          import('./pages/dashboard/admin-pages-dashboard.module').then(
            m => m.AdminPagesDashboardModule,
          ),
        data: {
          roles: MENU_ROLES.DASHBOARD,
        },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/admin-pages-products.module').then(
            m => m.AdminPagesProductsModule,
          ),
        data: {
          roles: MENU_ROLES.PRODUCTS,
        },
      },
      {
        path: 'product-categories',
        loadChildren: () =>
          import(
            './pages/product-categories/admin-pages-product-categories.module'
          ).then(m => m.AdminPagesProductCategoriesModule),
        data: {
          roles: MENU_ROLES.PRODUCT_CATEGORIES,
        },
      },
      {
        path: 'modifiers-and-extras',
        loadChildren: () =>
          import(
            './pages/modifiers-and-extras/admin-pages-modifiers-and-extras.module'
          ).then(m => m.AdminPagesModifiersAndExtrasModule),
        data: {
          roles: MENU_ROLES.MODIFIERS_AND_EXTRAS,
        },
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('./pages/groups/admin-pages-groups.module').then(
            m => m.AdminPagesGroupsModule,
          ),
        data: {
          roles: MENU_ROLES.GROUPS,
        },
      },
      {
        path: 'units',
        loadChildren: () =>
          import('./pages/units/admin-pages-units.module').then(
            m => m.AdminPagesUnitsModule,
          ),
        data: {
          roles: MENU_ROLES.UNITS,
        },
      },
      {
        path: 'chains',
        loadChildren: () =>
          import('./pages/chains/admin-pages-chains.module').then(
            m => m.AdminPagesChainsModule,
          ),
        data: {
          roles: MENU_ROLES.CHAINS,
        },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/admin-pages-users.module').then(
            m => m.AdminPagesUsersModule,
          ),
        data: {
          roles: MENU_ROLES.USERS,
        },
      },
      {
        path: 'admins',
        canActivateChild: [AuthGuard],
        loadChildren: () =>
          import('./pages/admin-users/admin-pages-admin-users.module').then(
            m => m.AdminPagesAdminUsersModule,
          ),
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
          import('./pages/auth/admin-pages-auth.module').then(
            m => m.AdminPagesAuthModule,
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
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
