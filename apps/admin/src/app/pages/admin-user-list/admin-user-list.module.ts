import { SharedComponentsModule } from '../../shared/modules/shared-components/shared-components.module';
import { SharedFormsModule } from '../../shared/modules/shared-forms';
import { PipesModule } from '../../shared/pipes';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

import { AdminUserListComponent } from './admin-user-list.component';
import { AdminUserFormComponent } from './components/admin-user-form/admin-user-form.component';
import { AdminUserListItemComponent } from './components/admin-user-list-item/admin-user-list-item.component';
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
  declarations: [
    AdminUserListComponent,
    AdminUserFormComponent,
    AdminUserListItemComponent,
    AdminUserRoleFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedFormsModule,
    SharedComponentsModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        component: AdminUserListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminUserListModule {}
