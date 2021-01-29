import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ORDERS_FEATURE_KEY, ordersReducer } from './+state/orders.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ORDERS_FEATURE_KEY, ordersReducer),
  ],
})
export class AdminSharedOrdersModule {}
