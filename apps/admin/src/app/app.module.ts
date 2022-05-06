import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEnGb from '@angular/common/locales/en-GB';
import localeHu from '@angular/common/locales/hu';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@bgap/admin/shared/config';
import { AdminSharedFloorMapModule } from '@bgap/admin/shared/floor-map';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { AdminSharedAppCoreModule } from '@bgap/admin/store/app-core';
import { AdminSharedDashboardModule } from '@bgap/admin/store/dashboard';
import { AdminSharedLoggedUserModule } from '@bgap/admin/store/logged-user';
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
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found.component';
import { EntityDataModule } from '@ngrx/data';
import { entityConfig } from '@bgap/admin/shared/data-access/ngrx-data';
import { AppInitializerService } from '@bgap/admin/shared/data-access/data';

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
  AdminSharedAppCoreModule,
  AdminSharedDashboardModule,
  AdminSharedFloorMapModule,
  AdminSharedLoggedUserModule,
];

registerLocaleData(localeDe);
registerLocaleData(localeHu);
registerLocaleData(localeEnGb);

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const initApp = (settingsService: AppInitializerService) => () =>
  settingsService.init$();

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
    EffectsModule.forRoot([]),
    EntityDataModule.forRoot(entityConfig),
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
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [AppInitializerService],
      multi: true,
    },
  ],
})
export class AppModule {}
