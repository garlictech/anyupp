import { SharedFormsModule } from 'src/app/shared/modules/shared-forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { LoginFormComponent } from './login-form/login-form.component';
import { LoginComponent } from './login.component';
import { PasswordResetFormComponent } from './password-reset-form/password-reset-form.component';

const NEBULAR_MODULES = [NbLayoutModule, NbCardModule, NbInputModule, NbButtonModule];

@NgModule({
  declarations: [LoginComponent, LoginFormComponent, PasswordResetFormComponent],
  imports: [
    CommonModule,
    SharedFormsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ...NEBULAR_MODULES,
    RouterModule.forChild([
      {
        component: LoginComponent,
        path: '',
      },
    ]),
  ],
})
export class LoginModule {}
