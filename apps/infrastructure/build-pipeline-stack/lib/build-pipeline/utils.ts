import * as iam from '@aws-cdk/aws-iam';
import * as ssm from '@aws-cdk/aws-ssm';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as sst from '@serverless-stack/resources';

export const configurePermissions = (
  stack: sst.Stack,
  secretsManager: SecretsManagerStack,
  resource: iam.IGrantable
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
    'AdminSiteUrl'
  ].forEach(param =>
    ssm.StringParameter.fromStringParameterName(
      stack,
      param + 'Param',
      'dev-anyupp-backend-' + param
    ).grantRead(resource)
  );
};
