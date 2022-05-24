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
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ChainFormComponent } from './components/chain-form/chain-form.component';
import { ChainListItemComponent } from './components/chain-list-item/chain-list-item.component';
import { ChainListComponent } from './components/chain-list/chain-list.component';
import { StyleColorPreviewComponent } from './components/style-color-preview/style-color-preview.component';
import { ChainListService } from './services/chain-list.service';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbSpinnerModule,
];

@NgModule({
  declarations: [
    ChainListComponent,
    ChainListItemComponent,
    ChainFormComponent,
    StyleColorPreviewComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedFormsModule,
    AdminSharedComponentsModule,
    ScrollingModule,
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
  providers: [ChainListService],
})
export class AdminPagesChainsModule {}
