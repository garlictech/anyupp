import { SharedComponentsModule } from 'src/app/shared/modules/shared-components';
import { SharedFormsModule } from 'src/app/shared/modules/shared-forms';
import { PipesModule } from 'src/app/shared/pipes';

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
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ChainListComponent } from './chain-list.component';
import { ChainFormComponent } from './components/chain-form/chain-form.component';
import { ChainListItemComponent } from './components/chain-list-item/chain-list-item.component';

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
    SharedFormsModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule.forChild([
      {
        component: ChainListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class ChainListModule {}
