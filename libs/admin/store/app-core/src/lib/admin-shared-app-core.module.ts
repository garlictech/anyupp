import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppCoreEffects } from './+state/app-core.effects';
import {
  APP_CORE_FEATURE_KEY,
  appCoreReducer,
} from './+state/app-core.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(APP_CORE_FEATURE_KEY, appCoreReducer),
    EffectsModule.forFeature([AppCoreEffects]),
  ],
})
export class AdminSharedAppCoreModule {}
