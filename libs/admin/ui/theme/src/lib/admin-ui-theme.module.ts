import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {
  NbActionsModule,
  NbButtonModule,
  NbContextMenuModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbUserModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSharedComponentsModule } from '@bgap/admin/shared/components';
import { FooterComponent, HeaderComponent } from './components';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
];

const COMPONENTS = [HeaderComponent, FooterComponent, AdminLayoutComponent];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    AdminSharedComponentsModule,
    ...NB_MODULES,
  ],
  exports: [CommonModule, ...COMPONENTS],
  declarations: [...COMPONENTS],
})
export class AdminUiThemeModule {}
