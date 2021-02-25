import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';
import { App } from '@serverless-stack/resources';
import { CfnOutput } from '@aws-cdk/core';

const secretsManagerArns: Record<string, string> = {
  dev:
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k',
  qa:
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-qa-secrets-4cFY1U',
};

export class SecretsManagerStack extends sst.Stack {
  public googleClientSecret: string;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    const secretsManagerArn =
      secretsManagerArns[scope.stage] || secretsManagerArns.dev;

    const secretManager = sm.Secret.fromSecretAttributes(
      this,
      'AnyuppSecrets',
      {
        secretArn: secretsManagerArn,
      },
    );

    const googleClientSecret = secretManager.secretValueFromJson(
      'googleClientSecret',
    );

    this.googleClientSecret = googleClientSecret.toString();

    new CfnOutput(this, 'SecretManager', {
      value: secretManager.secretArn,
      exportName: app.logicalPrefixedName('SecretManager'),
    });
  }
}
