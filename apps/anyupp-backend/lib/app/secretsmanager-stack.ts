import * as sm from '@aws-cdk/aws-secretsmanager';
import { CfnOutput } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import { App } from '@serverless-stack/resources';
import { secretsManagerArns } from '@bgap/anyupp-backend-lib';

export class SecretsManagerStack extends sst.Stack {
  public googleClientSecret: string;
  public facebookAppSecret: string;
  public stripeSecretKey: string;
  public stripeSigningSecret: string;
  public szamlazzhuAgentKey: string;
  public appleSigninKey: string;
  public apiAccessKeyId: string;
  public apiSecretAccessKey: string;
  public secretsManager: sm.ISecret;
  public reportAccessKeyID: string;
  public reportSecretAccessKey: string;
  public slackBotToken: string;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    const secretsManagerArn =
      secretsManagerArns[scope.stage] || secretsManagerArns.dev;

    this.secretsManager = sm.Secret.fromSecretAttributes(
      this,
      'AnyuppSecrets',
      {
        secretCompleteArn: secretsManagerArn,
      },
    );

    const appleSigninKeySecret = sm.Secret.fromSecretAttributes(
      this,
      'AppleSigninKey',
      {
        secretCompleteArn:
          app.stage === 'prod'
            ? secretsManagerArns.appleSigninKeyProd
            : secretsManagerArns.appleSigninKey,
      },
    );

    this.appleSigninKey = appleSigninKeySecret.secretValue.toString();

    const googleClientSecret =
      this.secretsManager.secretValueFromJson('googleClientSecret');
    this.googleClientSecret = googleClientSecret.toString();

    const facebookAppSecret =
      this.secretsManager.secretValueFromJson('facebookAppSecret');
    this.facebookAppSecret = facebookAppSecret.toString();

    //--- get Stripe secret keys
    const stripeSecretKey =
      this.secretsManager.secretValueFromJson('stripeSecretKey');
    this.stripeSecretKey = stripeSecretKey.toString();

    const stripeSigningSecret = this.secretsManager.secretValueFromJson(
      'stripeSigningSecret',
    );
    this.stripeSigningSecret = stripeSigningSecret.toString();

    const szamlazzhuAgentKey =
      this.secretsManager.secretValueFromJson('szamlazzhuAgentKey');
    this.szamlazzhuAgentKey = szamlazzhuAgentKey.toString();

    this.apiAccessKeyId = this.secretsManager
      .secretValueFromJson('apiAccessKeyId')
      .toString();

    this.apiSecretAccessKey = this.secretsManager
      .secretValueFromJson('apiSecretAccessKey')
      .toString();

    this.reportAccessKeyID = this.secretsManager
      .secretValueFromJson('reportAccessKeyID')
      .toString();

    this.reportSecretAccessKey = this.secretsManager
      .secretValueFromJson('reportSecretAccessKey')
      .toString();

    this.slackBotToken = this.secretsManager
      .secretValueFromJson('slackBotToken')
      .toString();

    new CfnOutput(this, 'SecretsManager', {
      value: this.secretsManager.secretArn,
      exportName: app.logicalPrefixedName('SecretsManager'),
    });
  }
}
