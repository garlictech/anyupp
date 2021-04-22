import { App, Stack } from '@serverless-stack/resources';

import { AppsyncAppStack } from './app/appsync-app-stack';
import { CognitoStack } from './app/cognito-stack';
import { ParamsStack } from './app/params-stack';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { SeederStack } from './app/seeder-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';

const certificateArn =
  'arn:aws:acm:us-east-1:568276182587:certificate/b669ca50-875b-4e03-99e3-2983e07d7088';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const sites = new SiteStack(scope, 'sites', { certificateArn });
    const secretsManagerStack = new SecretsManagerStack(
      scope,
      'SecretsManagerStack',
    );
    const paramsStack = new ParamsStack(scope, 'ParamsStack');

    const cognitoStack = new CognitoStack(scope, 'cognito', {
      adminSiteUrl: sites.adminSiteUrl,
      googleClientId: paramsStack.googleClientId,
      googleClientSecret: secretsManagerStack.googleClientSecret,
      facebookClientId: paramsStack.facebookAppId,
      facebookClientSecret: secretsManagerStack.facebookAppSecret,
    });

    new AppsyncAppStack(scope, 'appsync', {
      consumerUserPool: cognitoStack.consumerUserPool,
      adminUserPool: cognitoStack.adminUserPool,
      secretsManager: secretsManagerStack.secretsManager,
    });

    new StripeStack(scope, 'stripe');

    new SeederStack(scope, 'seeder', {
      adminUserPool: cognitoStack.adminUserPool,
    });
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}