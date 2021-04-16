import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Amplify from '@aws-amplify/core';
import { AppModule } from './app/app.module';
import { environment } from '@bgap/admin/shared/config';
import { awsConfig } from '@bgap/crud-gql/api';

awsConfig.oauth.redirectSignIn = `${window.location.origin}/admin/dashboard`;
awsConfig.oauth.redirectSignOut = `${window.location.origin}/auth/logout`;

Amplify.configure(awsConfig);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err): void => console.error(err));
