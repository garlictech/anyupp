import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';
import { App } from '@serverless-stack/resources';
import { CfnOutput } from '@aws-cdk/core';

export class SecretsManagerStack extends sst.Stack {
  public googleClientSecret: string;
  public secretsManagerArn =
    'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-dev-secrets-WtbZ0k';

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    const secretManager = sm.Secret.fromSecretAttributes(
      this,
      'AnyuppSecrets',
      {
        secretArn: this.secretsManagerArn,
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
