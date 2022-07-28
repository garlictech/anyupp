import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminSharedPipesModule } from '../../shared/pipes';
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

import { ActiveProductCategorySelectorComponent } from './components/active-product-category-selector';
import { ActiveUnitSelectorComponent } from './components/active-unit-selector';
import { AddressComponent } from './components/address';
import { AllergensComponent } from './components/allergens/allergens.component';
import { ColorizedLaneIconComponent } from './components/colorized-lane-icon';
import { ConfirmDialogComponent } from './components/confirm-dialog';
import { ContactComponent } from './components/contact';
import { GoogleMapComponent } from './components/google-map';
import { RkeeperInfoBlockComponent } from './components/rkeeper-info-block';
import { StatusLedComponent } from './components/status-led';
import { UnpayCategoriesComponent } from './components/unpay-categories';
import { VariantAvailabilityBadgeComponent } from './components/variant-availability-badge';
import { UserBlockComponent } from './components/user-block/user-block.component';

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
  NbButtonModule,
  NbDialogModule,
  NbSelectModule,
  NbCheckboxModule,
];

const COMPONENTS = [
  ContactComponent,
  AddressComponent,
  ActiveUnitSelectorComponent,
  ActiveProductCategorySelectorComponent,
  GoogleMapComponent,
  VariantAvailabilityBadgeComponent,
  ConfirmDialogComponent,
  StatusLedComponent,
  ColorizedLaneIconComponent,
  ContactComponent,
  AllergensComponent,
  UnpayCategoriesComponent,
  RkeeperInfoBlockComponent,
  UserBlockComponent,
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
