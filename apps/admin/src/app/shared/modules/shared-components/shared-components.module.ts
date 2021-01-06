import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbSelectModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { PipesModule } from '../../pipes';
import { ActiveChainSelectorComponent } from './components/active-chain-selector/active-chain-selector.component';
import { ActiveGroupSelectorComponent } from './components/active-group-selector/active-group-selector.component';
import { ActiveProductCategorySelectorComponent } from './components/active-product-category-selector/active-product-category-selector.component';
import { ActiveUnitSelectorComponent } from './components/active-unit-selector/active-unit-selector.component';
import { AddressComponent } from './components/address/address.component';
import { ColorizedLaneIconComponent } from './components/colorized-lane-icon/colorized-lane-icon.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ContactComponent } from './components/contact/contact.component';
import { FloorMapEditorComponent } from './components/floor-map-editor/floor-map-editor.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { LanguageSelectorComponent } from './components/language-selector/language-selector.component';
import { StatusLedComponent } from './components/status-led/status-led.component';
import { VariantAvailabilityBadgeComponent } from './components/variant-availability-badge/variant-availability-badge.component';

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
  LanguageSelectorComponent,
  GoogleMapComponent,
  VariantAvailabilityBadgeComponent,
  ConfirmDialogComponent,
  StatusLedComponent,
  ColorizedLaneIconComponent,
  FloorMapEditorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    GoogleMapsModule,
    ColorPickerModule,
    ...NB_MODULES,
  ],
  exports: [...COMPONENTS],
})
export class SharedComponentsModule {}
