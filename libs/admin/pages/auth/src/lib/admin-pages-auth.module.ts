import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminSharedFormsModule } from '@bgap/admin/shared/forms';
import { AdminSharedPipesModule } from '@bgap/admin/shared/pipes';
import { NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './components/login/login.component';

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
    LoginComponent
  ],
})
export class AdminPagesAuthModule {}
