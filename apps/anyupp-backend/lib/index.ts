import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import { App, Stack } from '@serverless-stack/resources';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { CognitoStack } from './app/cognito-stack';
import { ConfiguratorStack } from './app/configurator-stack';
import { FargateStack } from './app/fargate-stack';
import { ParamsStack } from './app/params-stack';
import { ReportGeneratorStack } from './app/report-generator-stack';
import { RKeeperStack } from './app/rkeeper-stack';
import { SecretsManagerStack } from './app/secretsmanager-stack';
//import { SeederStack } from './app/seeder-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';

export class AnyUppStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const secretsManagerStack = new SecretsManagerStack(
      scope,
      'SecretsManagerStack',
    );

    const paramsStack = new ParamsStack(scope, 'ParamsStack');

    const vpc = ec2.Vpc.fromLookup(this, 'AnyuppVpc', {
      vpcId: paramsStack.vpcId,
    });

    const securityGroupId = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      'AnyuppDefaultSecurityGroupId',
      paramsStack.securityGroupId,
    );

    const rootDomain = 'anyupp.com';

    const zone = route53.HostedZone.fromLookup(this, 'AnyuppHostedZone', {
      domainName: rootDomain,
    });

    const certificateArn =
      scope.stage === 'prod'
        ? 'arn:aws:acm:us-east-1:486782650003:certificate/d743bb2d-00a2-49b4-82c5-f1b46baaa0e9'
        : 'arn:aws:acm:us-east-1:568276182587:certificate/b669ca50-875b-4e03-99e3-2983e07d7088';

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'AnyuppCertificate',
      certificateArn,
    );

    const sites = new SiteStack(scope, 'sites', {
      rootDomain,
      certificate,
    });

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

    const fargateStack = new FargateStack(scope, 'fargate', {
      vpc,
      securityGroupId,
    });

    new AppsyncAppStack(scope, 'appsync', {
      consumerUserPool: cognitoStack.consumerUserPool,
      adminUserPool: cognitoStack.adminUserPool,
      stripeSecretKey: secretsManagerStack.stripeSecretKey,
      stripeSigningSecret: secretsManagerStack.stripeSigningSecret,
      secretsManager: secretsManagerStack.secretsManager,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      szamlazzhuAgentKey: secretsManagerStack.szamlazzhuAgentKey,
    });

    new ReportGeneratorStack(scope, 'report-generator', {
      reportAccessKeyId: secretsManagerStack.reportAccessKeyID,
      reportSecretAccessKey: secretsManagerStack.reportSecretAccessKey,
      slackChannel: paramsStack.slackChannel,
      vpc,
      userPoolId: cognitoStack.adminUserPool.userPoolId,
      slackBotToken: secretsManagerStack.slackBotToken,
      cluster: fargateStack.cluster,
    });

    new StripeStack(scope, 'stripe', {
      stripeSecretKey: secretsManagerStack.stripeSecretKey,
      stripeSigningSecret: secretsManagerStack.stripeSigningSecret,
      szamlazzhuAgentKey: secretsManagerStack.szamlazzhuAgentKey,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      zone,
      certificate,
      rootDomain,
    });

    new ConfiguratorStack(scope, 'configurator', {
      consumerUserPoolId: cognitoStack.consumerUserPool.userPoolId,
    });

    new RKeeperStack(scope, 'rkeeper', {
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      vpc,
      securityGroupId: paramsStack.securityGroupId,
      zone,
      certificate,
      rootDomain,
    });

    /*if (scope.stage === 'dev' || scope.stage === 'qa') {
      new SeederStack(scope, 'seeder', {
        adminUserPool: cognitoStack.adminUserPool,
        consumerUserPool: cognitoStack.consumerUserPool,
        anyuppApiArn: appsyncStack.api.arn,
        apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
        apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      });
    }
    */
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
