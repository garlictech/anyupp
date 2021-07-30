import { App, Stack } from '@serverless-stack/resources';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { CognitoStack } from './app/cognito-stack';
import { ConfiguratorStack } from './app/configurator-stack';
import { ParamsStack } from './app/params-stack';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { SeederStack } from './app/seeder-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const sites = new SiteStack(scope, 'sites', {});

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
      appleSigninKey: secretsManagerStack.appleSigninKey,
      appleTeamId: paramsStack.appleTeamId,
      appleKeyId: paramsStack.appleKeyId,
      appleServiceId: paramsStack.appleServiceId,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
    });

    const appsyncStack = new AppsyncAppStack(scope, 'appsync', {
      consumerUserPool: cognitoStack.consumerUserPool,
      adminUserPool: cognitoStack.adminUserPool,
      stripeSecretKey: secretsManagerStack.stripeSecretKey,
      stripeSigningSecret: secretsManagerStack.stripeSigningSecret,
      secretsManager: secretsManagerStack.secretsManager,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      szamlazzhuAgentKey: secretsManagerStack.szamlazzhuAgentKey,
    });

    new StripeStack(scope, 'stripe', {
      stripeSecretKey: secretsManagerStack.stripeSecretKey,
      stripeSigningSecret: secretsManagerStack.stripeSigningSecret,
      szamlazzhuAgentKey: secretsManagerStack.szamlazzhuAgentKey,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
    });

    new ConfiguratorStack(scope, 'configurator', {
      consumerUserPoolId: cognitoStack.consumerUserPool.userPoolId,
    });

    if (scope.stage === 'dev' || scope.stage === 'qa') {
      new SeederStack(scope, 'seeder', {
        adminUserPool: cognitoStack.adminUserPool,
        consumerUserPool: cognitoStack.consumerUserPool,
        anyuppApiArn: appsyncStack.api.arn,
        apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
        apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      });
    }
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
