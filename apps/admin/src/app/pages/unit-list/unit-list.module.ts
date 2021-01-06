import { SharedComponentsModule } from 'src/app/shared/modules/shared-components/shared-components.module';
import { SharedFormsModule } from 'src/app/shared/modules/shared-forms';
import { PipesModule } from 'src/app/shared/pipes';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { UnitListComponent } from './unit-list.component';

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
  declarations: [UnitListComponent, UnitListItemComponent, UnitFormComponent, UnitFloorMapComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SharedFormsModule,
    SharedComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    RouterModule.forChild([
      {
        component: UnitListComponent,
        path: '',
      },
    ]),
    ...NB_MODULES,
  ],
})
export class UnitListModule {}
