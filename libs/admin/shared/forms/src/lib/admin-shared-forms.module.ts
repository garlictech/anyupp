import { ColorPickerModule } from 'ngx-color-picker';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule,
  NbListModule, NbSelectModule, NbUserModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { AbstractFormDialogComponent } from './components/abstract-form-dialog';
import { FormAdminRoleComponent } from './components/form-admin-role';
import { FormChainAdminRoleComponent } from './components/form-admin-role/form-chain-admin-role';
import { FormGroupAdminRoleComponent } from './components/form-admin-role/form-group-admin-role';
import { FormStaffRoleComponent } from './components/form-admin-role/form-staff-role';
import { FormUnitAdminRoleComponent } from './components/form-admin-role/form-unit-admin-role';
import { FormCheckboxComponent } from './components/form-checkbox';
import { FormClickableImageInputComponent } from './components/form-clickable-image-input';
import { FormColorPickerComponent } from './components/form-color-picker';
import { FormContactGroupComponent } from './components/form-contact-group';
import { FormProductAvailabilitiesComponent } from './components/form-product-availabilities';
import { FormProductVariantsComponent } from './components/form-product-variants';
import { FormSelectComponent } from './components/form-select';
import { FormStaticTextComponent } from './components/form-static-text';
import { FormTextInputComponent } from './components/form-text-input';
import { FormUnitLanesComponent } from './components/form-unit-lanes';
import { FormWeeklyScheduleComponent } from './components/form-weekly-schedule';

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
  FormChainAdminRoleComponent,
  FormAdminRoleComponent,
  FormTextInputComponent,
  FormContactGroupComponent,
  FormClickableImageInputComponent,
  FormSelectComponent,
  FormUnitLanesComponent,
  FormCheckboxComponent,
  FormWeeklyScheduleComponent,
  FormProductVariantsComponent,
  FormProductAvailabilitiesComponent,
  FormChainAdminRoleComponent,
  FormGroupAdminRoleComponent,
  FormUnitAdminRoleComponent,
  FormStaffRoleComponent,
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
