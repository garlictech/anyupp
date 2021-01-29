import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';
import { ProductCategoryListItemComponent } from './components/product-category-list-item/product-category-list-item.component';
import { ProductCategoryListComponent } from './components/product-category-list/product-category-list.component';

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
    AdminSharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: ProductCategoryListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesProductCategoriesModule {}
