import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UnitsEffects } from './+state/units.effect';
import { UNITS_FEATURE_KEY, unitsReducer } from './+state/units.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(UNITS_FEATURE_KEY, unitsReducer),
    EffectsModule.forFeature([UnitsEffects]),
  ],
})
export class AdminSharedUnitsModule {}
