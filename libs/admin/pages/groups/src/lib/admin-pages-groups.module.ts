import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbUserModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { GroupFormComponent } from './components/group-form/group-form.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { GroupListComponent } from './components/group-list/group-list.component';

 const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbSelectModule,
];

@NgModule({
  declarations: [
    GroupListComponent,
    GroupListItemComponent,
    GroupFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    AdminSharedPipesModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        component: GroupListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesGroupsModule {}
