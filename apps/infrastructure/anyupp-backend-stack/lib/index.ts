import { CognitoStack } from './app/cognito-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { App } from '@serverless-stack/resources';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { ParamsStack } from './app/params-stack';

export default function main(app: App): void {
  //new SiteStack(app, 'sites');
  const secretManager = new SecretsManagerStack(app, 'SecretsManagerStack');
  const paramsStack = new ParamsStack(app, 'ParamsStack');

  new CognitoStack(app, 'cognito', {
    adminSiteUrl: 'https://telex.hu',
    googleClientId: paramsStack.googleClientId,
    googleClientSecret: secretManager.googleClientSecret
  });
  new AppsyncAppStack(app, 'appsync');
}
