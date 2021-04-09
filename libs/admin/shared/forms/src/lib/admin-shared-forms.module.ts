import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
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

import { AbstractFormDialogComponent } from './components/abstract-form-dialog/abstract-form-dialog.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { FormClickableImageInputComponent } from './components/form-clickable-image-input/form-clickable-image-input.component';
import { FormColorPickerComponent } from './components/form-color-picker/form-color-picker.component';
import { FormContactGroupComponent } from './components/form-contact-group/form-contact-group.component';
import { FormProductAvailabilitiesComponent } from './components/form-product-availabilities/form-product-availabilities.component';
import { FormProductVariantsComponent } from './components/form-product-variants/form-product-variants.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormStaticTextComponent } from './components/form-static-text/form-static-text.component';
import { FormTextInputComponent } from './components/form-text-input/form-text-input.component';
import { FormUnitLanesComponent } from './components/form-unit-lanes/form-unit-lanes.component';
import { FormWeeklyScheduleComponent } from './components/form-weekly-schedule/form-weekly-schedule.component';

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
  AbstractFormDialogComponent,
  FormTextInputComponent,
  FormContactGroupComponent,
  FormClickableImageInputComponent,
  FormSelectComponent,
  FormUnitLanesComponent,
  FormCheckboxComponent,
  FormWeeklyScheduleComponent,
  FormProductVariantsComponent,
  FormProductAvailabilitiesComponent,
  FormColorPickerComponent,
  FormStaticTextComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GoogleMapsModule,
    ColorPickerModule,
    AdminSharedComponentsModule,
    AdminSharedPipesModule,
    ...NB_MODULES,
  ],
  exports: [...COMPONENTS],
})
export class AdminSharedFormsModule {}
