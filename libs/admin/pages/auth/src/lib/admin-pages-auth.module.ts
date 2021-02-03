import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbLayoutModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';

const NEBULAR_MODULES = [
  NbLayoutModule,
  NbCardModule,
  NbInputModule,
  NbButtonModule,
];

@NgModule({
  imports: [
    CommonModule,
    AdminSharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    AdminSharedPipesModule,
    TranslateModule,
    ...NEBULAR_MODULES,
    RouterModule.forChild([
      {
        component: LoginComponent,
        path: '',
      },
    ]),
  ],
  declarations: [
    LoginComponent,
    LoginFormComponent,
    PasswordResetFormComponent,
  ],
})
export class AdminPagesAuthModule {}
