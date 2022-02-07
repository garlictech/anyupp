import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbListModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';
import { AdminUserListItemComponent } from './components/admin-user-list-item/admin-user-list-item.component';
import { AdminUserListComponent } from './components/admin-user-list/admin-user-list.component';
import { AdminUserRoleFormComponent } from './components/admin-user-role-form/admin-user-role-form.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbEvaIconsModule,
  NbButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ScrollingModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    AdminSharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        component: AdminUserListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
  declarations: [
    AdminUserListComponent,
    AdminUserListItemComponent,
    AdminUserFormComponent,
    AdminUserRoleFormComponent,
  ],
})
export class AdminPagesAdminUsersModule {}
