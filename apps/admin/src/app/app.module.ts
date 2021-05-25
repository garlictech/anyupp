import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEnGb from '@angular/common/locales/en-GB';
import localeHu from '@angular/common/locales/hu';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@bgap/admin/shared/config';
import { AdminSharedAdminUsersModule } from '@bgap/admin/shared/data-access/admin-users';
import { AdminSharedChainsModule } from '@bgap/admin/shared/data-access/chains';
import { AdminSharedDashboardModule } from '@bgap/admin/shared/data-access/dashboard';
import { AdminSharedGroupsModule } from '@bgap/admin/shared/data-access/groups';
import { AdminSharedLoggedUserModule } from '@bgap/admin/shared/data-access/logged-user';
import { AdminSharedOrdersModule } from '@bgap/admin/shared/data-access/orders';
import { AdminSharedProductCategoriesModule } from '@bgap/admin/shared/data-access/product-categories';
import { AdminSharedProductComponentsModule } from '@bgap/admin/shared/data-access/product-components';
import { AdminSharedProductsModule } from '@bgap/admin/shared/data-access/products';
import { AdminSharedRoleContextsModule } from '@bgap/admin/shared/data-access/role-contexts';
import { AdminSharedUnitsModule } from '@bgap/admin/shared/data-access/units';
import { AdminSharedUsersModule } from '@bgap/admin/shared/data-access/users';
import { AdminSharedFloorMapModule } from '@bgap/admin/shared/floor-map';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { AdminUiCoreModule } from '@bgap/admin/ui/core';
import { AdminUiThemeModule } from '@bgap/admin/ui/theme';
import {
  NbDialogModule,
  NbGlobalPhysicalPosition,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
} from '@nebular/theme';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found.component';
import { AdminSharedProductComponentSetsModule } from '@bgap/admin/shared/data-access/product-component-sets';

const NB_MODULES = [
  NbThemeModule.forRoot({ name: 'anyUppTheme' }),
  NbLayoutModule,
  NbSidebarModule.forRoot(),
  NbMenuModule.forRoot(),
  NbDialogModule.forRoot({
    hasBackdrop: true,
    closeOnBackdropClick: false,
    hasScroll: true,
    dialogClass: 'form-dialog',
  }),
  NbToastrModule.forRoot({
    duration: 1500,
    position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  }),
  AdminUiCoreModule.forRoot(),
  AdminUiThemeModule,
];

export const FEATURE_STORES = [
  AdminSharedAdminUsersModule,
  AdminSharedChainsModule,
  AdminSharedDashboardModule,
  AdminSharedFloorMapModule,
  AdminSharedGroupsModule,
  AdminSharedLoggedUserModule,
  AdminSharedOrdersModule,
  AdminSharedProductCategoriesModule,
  AdminSharedProductsModule,
  AdminSharedUnitsModule,
  AdminSharedUsersModule,
  AdminSharedRoleContextsModule,
  AdminSharedProductComponentsModule,
  AdminSharedProductComponentSetsModule,
];

registerLocaleData(localeDe);
registerLocaleData(localeHu);
registerLocaleData(localeEnGb);

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: DEFAULT_LANG,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forRoot(
      {},
      {
        metaReducers: !environment.production ? [] : [],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      },
    ),
    ...NB_MODULES,
    ...FEATURE_STORES,
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
        })
      : [],
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
