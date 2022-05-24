import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AdminSharedFormsModule } from '../../shared/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  NbButtonModule,
  NbCardModule,
  NbBadgeModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbTabsetModule,
  NbUserModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ProductExtendFormComponent } from './components/product-extend-form/product-extend-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductListItemComponent } from './components/product-list-item/product-list-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductListService } from './services/product-list.service';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbBadgeModule,
  NbCheckboxModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbSelectModule,
  NbTabsetModule,
  NbSpinnerModule,
];

@NgModule({
  declarations: [
    ProductListComponent,
    ProductListItemComponent,
    ProductFormComponent,
    ProductExtendFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: ProductListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
  providers: [ProductListService],
})
export class AdminPagesProductsModule {}
