import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { ScrollingModule } from '@angular/cdk/scrolling';
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
  NbSelectModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { RoleContextFormComponent } from './components/role-context-form/role-context-form.component';
import { RoleContextListItemComponent } from './components/role-context-list-item/role-context-list-item.component';
import { RoleContextListComponent } from './components/role-context-list/role-context-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbSelectModule,
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
        component: RoleContextListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
  declarations: [
    RoleContextFormComponent,
    RoleContextListItemComponent,
    RoleContextListComponent,
  ],
})
export class AdminPagesRoleContextsModule {}
