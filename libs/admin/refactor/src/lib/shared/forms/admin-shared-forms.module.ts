import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbRadioModule,
  NbSelectModule,
  NbTagModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { AbstractFormDialogComponent } from './components/abstract-form-dialog/abstract-form-dialog.component';
import { FormAllergensComponent } from './components/form-allergens/form-allergens.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';
import { FormClickableImageInputComponent } from './components/form-clickable-image-input/form-clickable-image-input.component';
import { FormColorPickerComponent } from './components/form-color-picker/form-color-picker.component';
import { FormContactGroupComponent } from './components/form-contact-group/form-contact-group.component';
import { FormOrderModeComponent } from './components/form-order-mode/form-order-mode.component';
import { FormProductAvailabilitiesComponent } from './components/form-product-availabilities/form-product-availabilities.component';
import { FormProductComponentItemComponent } from './components/form-product-component-item/form-product-component-item.component';
import { FormProductComponentsComponent } from './components/form-product-components/form-product-components.component';
import { FormProductVariantsComponent } from './components/form-product-variants/form-product-variants.component';
import { FormRadioGroupComponent } from './components/form-radio-group/form-radio-group.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormServingModeComponent } from './components/form-serving-mode/form-serving-mode.component';
import { FormStaticTextComponent } from './components/form-static-text/form-static-text.component';
import { FormTextInputComponent } from './components/form-text-input/form-text-input.component';
import { FormUnitLanesComponent } from './components/form-unit-lanes/form-unit-lanes.component';
import { FormUnitPosComponent } from './components/form-unit-pos/form-unit-pos.component';
import { FormWeeklyScheduleComponent } from './components/form-weekly-schedule/form-weekly-schedule.component';
import { FormRatingPolicyComponent } from './components/form-rating-policy/form-rating-policy.component';
import { FormTipPolicyComponent } from './components/form-tip-policy/form-tip-policy.component';
import { FormUnitServiceFeeComponent } from './components/form-unit-service-fee/form-unit-service-fee.component';

const NB_MODULES = [
  NbIconModule,
  NbEvaIconsModule,
  NbInputModule,
  NbTagModule,
  NbFormFieldModule,
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
  NbRadioModule,
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
  FormAllergensComponent,
  FormProductComponentsComponent,
  FormProductComponentItemComponent,
  FormUnitPosComponent,
  FormRadioGroupComponent,
  FormServingModeComponent,
  FormOrderModeComponent,
  FormRatingPolicyComponent,
  FormTipPolicyComponent,
  FormUnitServiceFeeComponent,
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
