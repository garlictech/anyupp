import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  PRODUCT_COMPONENT_SETS_FEATURE_KEY,
  productComponentSetsReducer,
} from './+state/product-component-sets.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      PRODUCT_COMPONENT_SETS_FEATURE_KEY,
      productComponentSetsReducer,
    ),
  ],
})
export class AdminSharedProductComponentSetsModule {}
