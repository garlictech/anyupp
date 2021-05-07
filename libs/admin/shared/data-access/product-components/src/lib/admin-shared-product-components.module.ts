import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { PRODUCT_COMPONENTS_FEATURE_KEY, productComponentsReducer } from './+state/product-components.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      PRODUCT_COMPONENTS_FEATURE_KEY,
      productComponentsReducer,
    )
  ],
})
export class AdminSharedProductComponentsModule {}
