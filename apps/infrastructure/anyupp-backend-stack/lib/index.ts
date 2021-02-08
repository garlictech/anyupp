import { CognitoStack } from './app/cognito-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { App } from '@serverless-stack/resources';
import { SecretsManagerStack } from './app/secretsmanager-stack';

export default function main(app: App): void {
  //new SiteStack(app, 'sites');
  const secretManager = new SecretsManagerStack(app, 'SecretsManagerStack');

  new CognitoStack(app, 'cognito', {
    adminSiteUrl: 'https://telex.hu',
    googleClientId:
      '1016713353610-j3k5ejo1pgo4pcfo3hos8027kkspc5a9.apps.googleusercontent.com',
    googleClientSecret: secretManager.googleClientId
  });
  new AppsyncAppStack(app, 'appsync');
}
