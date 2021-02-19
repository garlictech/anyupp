import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

export class ParamsStack extends sst.Stack {
  public googleClientId: string;
  public stripePublishableKey: string;

  constructor(scope: sst.App, id: string) {
    super(scope, id);
    const app = this.node.root as sst.App;

    this.googleClientId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'googleClientIdParam',
      {
        parameterName: app.stage + '-anyupp-backend-googleClientId', // TODO: configurable "root" app name
      },
    ).stringValue;

    new CfnOutput(this, 'googleClientIdOutput', {
      value: this.googleClientId,
      exportName: app.logicalPrefixedName('googleClientId'),
    });

    new ssm.StringParameter(this, 'googleClientId', {
      allowedPattern: '.*',
      description: 'The Google client ID',
      parameterName: app.logicalPrefixedName('googleClientId'),
      stringValue: this.googleClientId || '',
    });

    this.stripePublishableKey = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'stripePublishableKeyParam',
      {
        parameterName: app.stage + '-anyupp-backend-stripePublishableKey', // TODO: configurable "root" app name
      },
    ).stringValue;

    new ssm.StringParameter(this, 'stripePublishableKey', {
      allowedPattern: '.*',
      description: 'The Stripe Publishable Key',
      parameterName: app.logicalPrefixedName('stripePublishableKey'),
      stringValue: this.stripePublishableKey || '',
    });

    new CfnOutput(this, 'stripePublishableKeyOutput', {
      value: this.stripePublishableKey,
      exportName: app.logicalPrefixedName('stripePublishableKey'),
    });
  }
}
