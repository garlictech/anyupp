import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

export class SecretsManagerStack extends sst.Stack {
  public googleClientId: string;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    this.googleClientId = sm.Secret.fromSecretAttributes(
      this,
      'AnyuppSecrets',
      {
        secretArn:
          'arn:aws:secretsmanager:eu-west-1:568276182587:secret:anyupp-client-secrets-4dFgfW'
      }
    )
      .secretValueFromJson('googleClientSecret')
      .toString();
  }
}
