import {
  aws_ec2 as ec2,
  aws_certificatemanager as acm,
  aws_route53 as route53,
} from 'aws-cdk-lib';
import { App, Stack } from '@serverless-stack/resources';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { CognitoStack } from './app/cognito-stack';
import { ConfiguratorStack } from './app/configurator-stack';
import { ParamsStack } from './app/params-stack';
import { RKeeperStack } from './app/rkeeper-stack';
import { SecretsManagerStack } from './app/secretsmanager-stack';
import { SiteStack } from './app/site-stack';
import { StripeStack } from './app/stripe-stack';
import { AnyuppBackupStack } from './app/backup-stack';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { OpenSearchCustomStack } from './app/opensearch-custom-stack';
import { WafStack } from './app/waf-stack';

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

    const rootDomain = 'anyupp.com';

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      'AnyuppHostedZone',
      {
        hostedZoneId: 'Z07724744XHDX57X0R8H',
        zoneName: 'anyupp.com',
      },
    );

    const certificateArn =
      scope.stage === 'prod'
        ? 'arn:aws:acm:us-east-1:486782650003:certificate/d743bb2d-00a2-49b4-82c5-f1b46baaa0e9'
        : 'arn:aws:acm:us-east-1:568276182587:certificate/b669ca50-875b-4e03-99e3-2983e07d7088';

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'AnyuppCertificate',
      certificateArn,
    );

    if (scope.stage === ('dev' || 'prod')) {
      new AnyuppBackupStack(scope, 'backups');
    }

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
      stripeSecretKeyNewApi: secretsManagerStack.stripeSecretKeyNewApi,
      stripeSigningSecretNewApi: secretsManagerStack.stripeSigningSecretNewApi,
      szamlazzhuAgentKey: secretsManagerStack.szamlazzhuAgentKey,
      apiAccessKeyId: secretsManagerStack.apiAccessKeyId,
      apiSecretAccessKey: secretsManagerStack.apiSecretAccessKey,
      zone,
      certificate,
      rootDomain,
    });

    new ConfiguratorStack(scope, 'configurator', {
      consumerUserPoolId: cognitoStack.consumerUserPool.userPoolId,
      appSynclogPublisherRoleArn: appsyncStack.appSyncLogPublisherRole.roleArn,
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

    new OpenSearchCustomStack(scope, 'opensearch-custom', {
      openSearchArn: CrudApiConfig.openSearchArn,
    });

    if (['prod', 'qa', 'dev', 'staging'].includes(scope.stage)) {
      new WafStack(scope, 'waf', {
        graphqlApiId: CrudApiConfig.appsyncApiId,
      });
    }
  }
}

export default function main(app: App): void {
  new AnyUppStack(app, 'anyupp');
}
