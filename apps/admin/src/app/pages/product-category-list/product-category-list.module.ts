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
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';
import { ProductCategoryListItemComponent } from './components/product-category-list-item/product-category-list-item.component';
import { ProductCategoryListComponent } from './product-category-list.component';

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
    ProductCategoryListComponent,
    ProductCategoryFormComponent,
    ProductCategoryListItemComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule.forChild([
      {
        component: ProductCategoryListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class ProductCategoryListModule {}
