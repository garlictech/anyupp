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
import { AppsAdminModule } from '@bgap/apps/admin';
import { AdminSharedComponentsModule } from '../../shared/components';
import { AdminSharedPipesModule } from '../../shared/pipes';
import { FooterComponent, HeaderComponent } from './components';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AbsNotificationToggleService } from '@bgap/domain';
import { NotificationToggleService } from './services/NotificationToggle.service';

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
    AdminSharedPipesModule,
    AppsAdminModule,
    ...NB_MODULES,
  ],
  exports: [CommonModule, ...COMPONENTS],
  declarations: [...COMPONENTS],
  providers: [
    {
      provide: AbsNotificationToggleService,
      useClass: NotificationToggleService,
    },
  ],
})
export class AdminUiThemeModule {}
