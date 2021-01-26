import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbCheckboxModule, NbIconModule, NbInputModule, NbLayoutModule, NbListModule,
  NbSpinnerModule, NbUserModule
} from '@nebular/theme';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { UnitsEffects } from './+state/units.effects';
import * as fromUnits from './+state/units.reducer';
import { UnitFloorMapComponent } from './components/unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from './components/unit-form/unit-form.component';
import { UnitListItemComponent } from './components/unit-list-item/unit-list-item.component';
import { UnitListComponent } from './components/unit-list/unit-list.component';

const NB_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbCheckboxModule,
  NbSpinnerModule,
];

@NgModule({
  declarations: [
    UnitListComponent,
    UnitListItemComponent,
    UnitFormComponent,
    UnitFloorMapComponent,
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromUnits.UNITS_FEATURE_KEY, fromUnits.reducer),
    EffectsModule.forFeature([UnitsEffects]),
    TranslateModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    RouterModule.forChild([
      {
        component: UnitListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class AdminPagesUnitsModule {}
