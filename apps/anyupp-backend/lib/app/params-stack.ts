import * as ssm from '@aws-cdk/aws-ssm';
import { CfnOutput } from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';

const rootAppName = 'anyupp-backend';

export class ParamsStack extends sst.Stack {
  public googleClientId: string;
  public facebookAppId: string;
  public stripePublishableKey: string;

  constructor(scope: sst.App, id: string) {
    super(scope, id);
    const app = this.node.root as sst.App;

    this.googleClientId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'googleClientIdParam',
      {
        parameterName: `${app.stage}-${rootAppName}-googleClientId`,
      },
    ).stringValue;

    new CfnOutput(this, 'googleClientIdOutput', {
      value: this.googleClientId,
      exportName: app.logicalPrefixedName('googleClientId'),
    });

    this.facebookAppId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'facebookAppIdParam',
      {
        parameterName: `${app.stage}-${rootAppName}-facebookAppId`,
      },
    ).stringValue;

    new CfnOutput(this, 'facebookAppIdOutput', {
      value: this.facebookAppId,
      exportName: app.logicalPrefixedName('facebookAppId'),
    });

    this.stripePublishableKey = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'stripePublishableKeyParam',
      {
        parameterName: `${app.stage}-${rootAppName}-stripePublishableKey`,
      },
    ).stringValue;

    new CfnOutput(this, 'stripePublishableKeyOutput', {
      value: this.stripePublishableKey,
      exportName: app.logicalPrefixedName('stripePublishableKey'),
    });
  }
}
