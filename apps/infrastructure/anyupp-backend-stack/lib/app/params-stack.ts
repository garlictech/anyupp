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
        parameterName: app.logicalPrefixedName('googleClientId')
      }
    ).stringValue;

    new CfnOutput(this, 'googleClientId', {
      value: this.googleClientId,
      exportName: app.logicalPrefixedName('googleClientId')
    });

    this.stripePublishableKey = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'stripePublishableKeyParam',
      {
        parameterName: app.logicalPrefixedName('stripePublishableKey')
      }
    ).stringValue;

    new CfnOutput(this, 'stripePublishableKey', {
      value: this.stripePublishableKey,
      exportName: app.logicalPrefixedName('stripePublishableKey')
    });
  }
}
