import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { DashboardEffects } from './+state/dashboard.effects';
import {
  DASHBOARD_FEATURE_KEY,
  dashboardReducer,
} from './+state/dashboard.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DASHBOARD_FEATURE_KEY, dashboardReducer),
    EffectsModule.forFeature([DashboardEffects]),
  ],
})
export class AdminSharedDashboardModule {}
