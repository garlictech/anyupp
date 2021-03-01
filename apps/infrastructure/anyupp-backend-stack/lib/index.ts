import { CognitoStack } from './app/cognito-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { App, Stack } from '@serverless-stack/resources';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { ParamsStack } from './app/params-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const sites = new SiteStack(scope, 'sites');
    const secretManagerStack = new SecretsManagerStack(
      scope,
      'SecretsManagerStack',
    );
    const paramsStack = new ParamsStack(scope, 'ParamsStack');

    const cognitoStack = new CognitoStack(scope, 'cognito', {
      adminSiteUrl: sites.adminSiteUrl,
      googleClientId: paramsStack.googleClientId,
      googleClientSecret: secretManagerStack.googleClientSecret,
      facebookClientId: paramsStack.facebookAppId,
      facebookClientSecret: secretManagerStack.facebookAppSecret,
    });
    new AppsyncAppStack(scope, 'appsync', {
      cognitoUserPool: cognitoStack.userPool,
      secretManager: secretManagerStack.secretManager,
    });
    new StripeStack(scope, 'stripe');
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
