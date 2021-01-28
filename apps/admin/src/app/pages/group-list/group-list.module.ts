import { SharedComponentsModule } from '../../shared/modules/shared-components';
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
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { GroupFormComponent } from './components/group-form/group-form.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { GroupListComponent } from './group-list.component';

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
    SharedFormsModule,
    SharedComponentsModule,
    PipesModule,
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
export class GroupListModule {}
