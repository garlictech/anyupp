import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedFloorMapModule } from '@bgap/admin/shared/floor-map';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSpinnerModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
    AdminSharedComponentsModule,
    AdminSharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    AdminSharedFloorMapModule,
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
