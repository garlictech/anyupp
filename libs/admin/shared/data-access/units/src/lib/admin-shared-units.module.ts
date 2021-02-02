import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { UNITS_FEATURE_KEY, unitsReducer } from './+state/units.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(UNITS_FEATURE_KEY, unitsReducer),
  ],
})
export class AdminSharedUnitsModule {}
