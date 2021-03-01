import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify  from '@aws-amplify/core';
import { AppModule } from './app/app.module';
import { environment } from '@bgap/admin/shared/config';
import { AWS_CONFIG } from '@bgap/admin/shared/config';

Amplify.configure(AWS_CONFIG);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err): void => console.error(err));
