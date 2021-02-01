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
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ChainFormComponent } from './components/chain-form/chain-form.component';
import { ChainListItemComponent } from './components/chain-list-item/chain-list-item.component';
import { ChainListComponent } from './components/chain-list/chain-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
];

@NgModule({
  declarations: [
    ChainListComponent,
    ChainListItemComponent,
    ChainFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedFormsModule,
    AdminSharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: ChainListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesChainsModule {}
