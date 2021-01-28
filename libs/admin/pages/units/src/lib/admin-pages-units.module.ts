import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitFormComponent } from './components/unit-form/unit-form.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';
import { UnitListItemComponent } from './components/unit-list-item/unit-list-item.component';
import { UnitFloorMapComponent } from './components/unit-floor-map/unit-floor-map.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromUnits from './+state/units.reducer';
import { UnitsEffects } from './+state/units.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUnits.UNITS_FEATURE_KEY, fromUnits.reducer),
    EffectsModule.forFeature([UnitsEffects]),
  ],
  declarations: [
    UnitFormComponent,
    UnitListComponent,
    UnitListItemComponent,
    UnitFloorMapComponent,
  ],
})
export class AdminPagesUnitsModule {}
