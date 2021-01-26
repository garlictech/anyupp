import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule,
  NbListModule, NbSelectModule, NbUserModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { ActiveChainSelectorComponent } from './components/active-chain-selector';
import { ActiveGroupSelectorComponent } from './components/active-group-selector';
import { ActiveProductCategorySelectorComponent } from './components/active-product-category-selector';
import { ActiveUnitSelectorComponent } from './components/active-unit-selector';
import { AddressComponent } from './components/address';
import { ColorizedLaneIconComponent } from './components/colorized-lane-icon';
import { ConfirmDialogComponent } from './components/confirm-dialog';
import { ContactComponent } from './components/contact';
import { GoogleMapComponent } from './components/google-map';
import { StatusLedComponent } from './components/status-led';
import { VariantAvailabilityBadgeComponent } from './components/variant-availability-badge';

const NB_MODULES = [
  NbIconModule,
  NbEvaIconsModule,
  NbInputModule,
  NbButtonModule,
  NbLayoutModule,
  NbCardModule,
  NbListModule,
  NbUserModule,
  NbIconModule,
  NbInputModule,
  NbEvaIconsModule,
  NbButtonModule,
  NbDialogModule,
  NbSelectModule,
  NbCheckboxModule,
];

const COMPONENTS = [
  ContactComponent,
  AddressComponent,
  ActiveChainSelectorComponent,
  ActiveGroupSelectorComponent,
  ActiveUnitSelectorComponent,
  ActiveProductCategorySelectorComponent,
  GoogleMapComponent,
  VariantAvailabilityBadgeComponent,
  ConfirmDialogComponent,
  StatusLedComponent,
  ColorizedLaneIconComponent,
  ContactComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AdminSharedPipesModule,
    GoogleMapsModule,
    ColorPickerModule,
    ...NB_MODULES,
  ],
  exports: [...COMPONENTS],
})
export class AdminSharedComponentsModule {}
