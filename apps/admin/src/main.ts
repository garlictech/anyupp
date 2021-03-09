import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify from '@aws-amplify/core';
import { AppModule } from './app/app.module';
import { environment } from '@bgap/admin/shared/config';
import { awsConfig } from '@bgap/admin/amplify-api';

Amplify.configure(awsConfig);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err): void => console.error(err));
