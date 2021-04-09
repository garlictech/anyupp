import { AdminLayoutComponent } from '@bgap/admin/ui/theme';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MENU_ROLES } from '@bgap/admin/shared/utils';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@bgap/admin/pages/dashboard').then(
            m => m.AdminPagesDashboardModule,
          ),
        data: {
          roles: MENU_ROLES.DASHBOARD,
        },
      },
      {
        path: 'products',
        loadChildren: () =>
          import('@bgap/admin/pages/products').then(
            m => m.AdminPagesProductsModule,
          ),
        data: {
          roles: MENU_ROLES.PRODUCTS,
        },
      },
      {
        path: 'product-categories',
        loadChildren: () =>
          import('@bgap/admin/pages/product-categories').then(
            m => m.AdminPagesProductCategoriesModule,
          ),
        data: {
          roles: MENU_ROLES.PRODUCT_CATEGORIES,
        },
      },
      {
        path: 'groups',
        loadChildren: () =>
          import('@bgap/admin/pages/groups').then(
            m => m.AdminPagesGroupsModule,
          ),
        data: {
          roles: MENU_ROLES.GROUPS,
        },
      },
      {
        path: 'units',
        loadChildren: () =>
          import('@bgap/admin/pages/units').then(m => m.AdminPagesUnitsModule),
        data: {
          roles: MENU_ROLES.UNITS,
        },
      },
      {
        path: 'chains',
        loadChildren: () =>
          import('@bgap/admin/pages/chains').then(
            m => m.AdminPagesChainsModule,
          ),
        data: {
          roles: MENU_ROLES.CHAINS,
        },
      },
      {
        path: 'users',
        loadChildren: () =>
          import('@bgap/admin/pages/users').then(m => m.AdminPagesUsersModule),
        data: {
          roles: MENU_ROLES.USERS,
        },
      },
      {
        path: 'admins',
        loadChildren: () =>
          import('@bgap/admin/pages/admin-users').then(
            m => m.AdminPagesAdminUsersModule,
          ),
        data: {
          roles: MENU_ROLES.ADMINS,
        },
      },
      {
        path: 'role-contexts',
        loadChildren: () =>
          import('@bgap/admin/pages/role-contexts').then(
            m => m.AdminPagesRoleContextsModule,
          ),
        data: {
          roles: MENU_ROLES.ROLE_CONTEXTS,
        },
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
