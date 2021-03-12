
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEnGb from '@angular/common/locales/en-GB';
import localeHu from '@angular/common/locales/hu';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminSharedAdminUsersModule } from '@bgap/admin/shared/data-access/admin-users';
import { AdminSharedChainsModule } from '@bgap/admin/shared/data-access/chains';
import { environment } from '@bgap/admin/shared/config';
import { AdminSharedDashboardModule } from '@bgap/admin/shared/data-access/dashboard';
import { AdminSharedFloorMapModule } from '@bgap/admin/shared/floor-map';
import { AdminSharedGroupsModule } from '@bgap/admin/shared/data-access/groups';
import { AdminSharedLoggedUserModule } from '@bgap/admin/shared/data-access/logged-user';
import { AdminSharedOrdersModule } from '@bgap/admin/shared/data-access/orders';
import { AdminSharedProductCategoriesModule } from '@bgap/admin/shared/data-access/product-categories';
import { AdminSharedProductsModule } from '@bgap/admin/shared/data-access/products';
import { AdminSharedUnitsModule } from '@bgap/admin/shared/data-access/units';
import { AdminSharedUsersModule } from '@bgap/admin/shared/data-access/users';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { AdminUiCoreModule } from '@bgap/admin/ui/core';
import { AdminUiThemeModule } from '@bgap/admin/ui/theme';
import { FIREBASE_CONFIG } from '@bgap/shared/config';
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
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

const NB_MODULES = [
  NbThemeModule.forRoot({ name: 'anyUppTheme' }),
  NbLayoutModule,
  NbSidebarModule.forRoot(),
  NbMenuModule.forRoot(),
  NbDialogModule.forRoot({
    hasBackdrop: true,
    closeOnBackdropClick: false,
    hasScroll: true,
  }),
  NbToastrModule.forRoot({
    duration: 1500,
    position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
  }),
  AdminUiCoreModule.forRoot(),
  AdminUiThemeModule,
];

const FIREBASE_MODULES = [
  AngularFireModule.initializeApp(FIREBASE_CONFIG),
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  AngularFireStorageModule,
  AngularFireFunctionsModule,
];

registerLocaleData(localeDe);
registerLocaleData(localeHu);
registerLocaleData(localeEnGb);

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AmplifyAngularModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: DEFAULT_LANG,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ...NB_MODULES,
    ...FIREBASE_MODULES,
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
    // Store modules
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
  ],
  providers: [
    AmplifyService,
    { provide: REGION, useValue: 'europe-west3' },

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
