import { CognitoStack } from './app/cognito-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { App, Stack } from '@serverless-stack/resources';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { ParamsStack } from './app/params-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';
import { DynamoDBStack } from './app/appsync-dynamodb-stack';
import { DynamoDBSeederStack } from './app/seeder/dynamodb-seeder-stack';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const sites = new SiteStack(scope, 'sites');
    const secretsManagerStack = new SecretsManagerStack(
      scope,
      'SecretsManagerStack',
    );
    const paramsStack = new ParamsStack(scope, 'ParamsStack');
    const dynamoDBStack = new DynamoDBStack(scope, 'dynamoDB');

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
      dynamoDBStack,
    });

    new StripeStack(scope, 'stripe');
    new DynamoDBSeederStack(scope, 'dynamoDBSeeder', {
      dynamoDBStack,
      userPool: cognitoStack.userPool,
    });
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
