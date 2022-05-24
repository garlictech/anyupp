import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AdminSharedFormsModule } from '../../shared/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { GroupFormComponent } from './components/group-form/group-form.component';
import { GroupListItemComponent } from './components/group-list-item/group-list-item.component';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupListService } from './services/group-list.service';

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
  NbSpinnerModule,
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
    ScrollingModule,
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
  providers: [GroupListService],
})
export class AdminPagesGroupsModule {}
