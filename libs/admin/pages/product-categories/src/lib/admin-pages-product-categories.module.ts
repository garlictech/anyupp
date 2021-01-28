import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule, NbSelectModule, NbUserModule
} from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { ProductCategoriesEffects } from './+state/product-categories.effects';
import * as fromProductCategories from './+state/product-categories.reducer';
import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';
import {
  ProductCategoryListItemComponent
} from './components/product-category-list-item/product-category-list-item.component';
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
    StoreModule.forFeature(
      fromProductCategories.PRODUCT_CATEGORIES_FEATURE_KEY,
      fromProductCategories.reducer
    ),
    EffectsModule.forFeature([ProductCategoriesEffects]),
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
