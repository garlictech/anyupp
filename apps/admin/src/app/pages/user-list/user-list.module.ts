import { SharedFormsModule } from 'src/app/shared/modules/shared-forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbListModule, NbUserModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListItemComponent } from './components/user-list-item/user-list-item.component';
import { UserListComponent } from './user-list.component';

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
  declarations: [UserListComponent, UserListItemComponent, UserFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        component: UserListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class UserListModule {}
