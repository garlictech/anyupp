import { App, Stack } from '@serverless-stack/resources';

import { AppsyncAppStack } from './app/appsync-app-stack';
import { CognitoStack } from './app/cognito-stack';
import { ParamsStack } from './app/params-stack';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { StripeStack } from './app/stripe-stack';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    // const sites = new SiteStack(scope, 'sites');
    const secretsManagerStack = new SecretsManagerStack(
      scope,
      'SecretsManagerStack',
    );
    const paramsStack = new ParamsStack(scope, 'ParamsStack');
    // const dynamoDBStack = new DynamoDBStack(scope, 'dynamoDB');

    const cognitoStack = new CognitoStack(scope, 'cognito', {
      // adminSiteUrl: sites.adminSiteUrl,
      adminSiteUrl: 'http://localhost:4200', // TODO: re enable admin site
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
    // TODO
    // new DynamoDBSeederStack(scope, 'dynamoDBSeeder', {
    //   dynamoDBStack,
    //   userPool: cognitoStack.consumerUserPool,
    // });
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
