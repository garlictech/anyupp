import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AmplifyUIAngularModule } from '@aws-amplify/ui-angular';
import { AdminSharedFormsModule } from '../../shared/forms';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { NbLayoutModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './components/login/login.component';

const NEBULAR_MODULES = [NbLayoutModule];

@NgModule({
  imports: [
    CommonModule,
    AdminSharedFormsModule,
    FormsModule,
    AdminSharedPipesModule,
    TranslateModule,
    AmplifyUIAngularModule,
    ...NEBULAR_MODULES,
    RouterModule.forChild([
      {
        component: LoginComponent,
        path: '',
      },
    ]),
  ],
  declarations: [LoginComponent],
})
export class AdminPagesAuthModule {}
