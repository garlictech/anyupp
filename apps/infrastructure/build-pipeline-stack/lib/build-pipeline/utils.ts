import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sst from '@serverless-stack/resources';
import * as chatbot from '@aws-cdk/aws-chatbot';

export interface PipelineStackProps extends sst.StackProps {
  readonly chatbot: chatbot.SlackChannelConfiguration;
  readonly repoName: string;
  readonly repoOwner: string;
  readonly repoBranch: string;
  readonly secretsManager: SecretsManagerStack;
}

export const configurePermissions = (
  stack: sst.Stack,
  secretsManager: SecretsManagerStack,
  resource: iam.IGrantable,
  prefix: string,
) => {
  secretsManager.anyuppDevSecret.grantRead(resource);

  [
    'UserPoolClientId',
    'UserPoolId',
    'UserPoolDomain',
    'IdentityPoolId',
    'GraphqlApiKey',
    'GraphqlApiUrl',
    'googleClientId',
    'stripePublishableKey',
    'AdminSiteUrl',
    'StripeWebhookEndpoint',
  ].forEach(param =>
    ssm.StringParameter.fromStringParameterName(
      stack,
      param + 'Param',
      prefix + '-' + param,
    ).grantRead(resource),
  );
};
