import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import {
  DASHBOARD_FEATURE_KEY,
  dashboardReducer,
} from './+state/dashboard.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DASHBOARD_FEATURE_KEY, dashboardReducer),
  ],
})
export class AdminSharedDashboardModule {}
