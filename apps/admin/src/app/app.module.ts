import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { OperationDefinitionNode } from 'graphql';

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
import { ApolloClientOptions, InMemoryCache, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import {
  NbDialogModule,
  NbGlobalPhysicalPosition,
  NbLayoutModule,
  NbMenuModule,
  NbSidebarModule,
  NbThemeModule,
  NbToastrModule,
} from '@nebular/theme';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DEFAULT_LANG } from './shared/const';
import { AppStoreModule } from './store';
import { FIREBASE_CONFIG } from '@bgap/shared/config';

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
  CoreModule.forRoot(),
  ThemeModule,
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
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppStoreModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
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
  ],
  providers: [
    { provide: REGION, useValue: 'europe-west3' },
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink): ApolloClientOptions<any> {
        // Create an http link:
        const http = httpLink.create({
          // uri: `https://graphql-inmg2ygdca-uc.a.run.app/graphql`,
          uri: `http://localhost:3333/graphql`,
        });

        // Create a WebSocket link:
        const ws = new WebSocketLink({
          // uri: `wss://graphql-inmg2ygdca-uc.a.run.app/graphql`,
          uri: `ws://localhost:3333/graphql`,
          options: {
            reconnect: true,
          },
        });

        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        const link = split(
          // split based on operation type
          ({ query }) => {
            const { kind, operation } = getMainDefinition(
              query
            ) as OperationDefinitionNode;
            return (
              kind === 'OperationDefinition' && operation === 'subscription'
            );
          },
          ws,
          http
        );

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
