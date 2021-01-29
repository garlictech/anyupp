import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PRODUCT_CATEGORIES_FEATURE_KEY, productCategoriesReducer } from './+state/product-categories.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(PRODUCT_CATEGORIES_FEATURE_KEY, productCategoriesReducer)
  ],
})
export class AdminSharedProductCategoriesModule {}
