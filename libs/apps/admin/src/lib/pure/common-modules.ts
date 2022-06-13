import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const commonStorybookImports = [
  HttpClientModule,
  TranslateModule.forRoot({
    defaultLanguage: 'en-US',
    loader: {
      provide: TranslateLoader,
      useFactory: (http: HttpClient): TranslateHttpLoader =>
        new TranslateHttpLoader(http, './assets/i18n/', '.json'),
      deps: [HttpClient],
    },
  }),
];
export const commonStorybookMockedImports = [
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useClass: TranslateFakeLoader,
    },
  }),
];
