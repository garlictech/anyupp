import { aws_ssm as ssm, CfnOutput } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import {
  anyuppVpcSecurityGroupParamName,
  anyuppVpcIdParamName,
} from '@bgap/backend/shared/utils';

const rootAppName = 'anyupp-backend';

export class ParamsStack extends sst.Stack {
  public googleClientId: string;
  public facebookAppId: string;
  public stripePublishableKey: string;
  public googleApiKey: string;
  public appleTeamId: string;
  public appleKeyId: string;
  public appleServiceId: string;
  public slackChannel: string;
  public vpcId: string;
  public securityGroupId: string;

  constructor(scope: sst.App, id: string) {
    super(scope, id);
    const app = this.node.root as sst.App;

    this.googleClientId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'googleClientIdParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/GoogleClientId`,
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
        parameterName: `/${app.stage}-${rootAppName}/FacebookAppId`,
      },
    ).stringValue;

    new CfnOutput(this, 'facebookAppIdOutput', {
      value: this.facebookAppId,
      exportName: app.logicalPrefixedName('facebookAppId'),
    });

    this.stripePublishableKey =
      ssm.StringParameter.fromStringParameterAttributes(
        this,
        'stripePublishableKeyParam',
        {
          parameterName: `/${app.stage}-${rootAppName}/StripePublishableKey`,
        },
      ).stringValue;

    new CfnOutput(this, 'stripePublishableKeyOutput', {
      value: this.stripePublishableKey,
      exportName: app.logicalPrefixedName('stripePublishableKey'),
    });

    this.googleApiKey = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'googleApiKeyParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/GoogleApiKey`,
      },
    ).stringValue;

    new CfnOutput(this, 'googleApiKeyOutput', {
      value: this.googleApiKey,
      exportName: app.logicalPrefixedName('googleApiKey'),
    });

    this.appleTeamId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'appleTeamIdParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/AppleTeamId`,
      },
    ).stringValue;

    new CfnOutput(this, 'appleTeamIdOutput', {
      value: this.appleTeamId,
      exportName: app.logicalPrefixedName('appleTeamId'),
    });

    this.appleKeyId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'appleKeyIdParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/AppleKeyId`,
      },
    ).stringValue;

    new CfnOutput(this, 'appleKeyIdOutput', {
      value: this.appleKeyId,
      exportName: app.logicalPrefixedName('appleKeyId'),
    });

    this.appleServiceId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'appleServiceIdParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/AppleServiceId`,
      },
    ).stringValue;

    new CfnOutput(this, 'appleServiceIdOutput', {
      value: this.appleServiceId,
      exportName: app.logicalPrefixedName('appleServiceId'),
    });

    this.slackChannel = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'slackChannelParam',
      {
        parameterName: `/${app.stage}-${rootAppName}/slackChannel`,
      },
    ).stringValue;

    new CfnOutput(this, 'slackChannelOutput', {
      value: this.appleServiceId,
      exportName: app.logicalPrefixedName('slackChannel'),
    });

    this.vpcId = ssm.StringParameter.valueFromLookup(
      this,
      anyuppVpcIdParamName,
    );

    new CfnOutput(this, 'vpcIdOutput', {
      value: this.vpcId,
      exportName: app.logicalPrefixedName('vpcId'),
    });

    this.securityGroupId = ssm.StringParameter.fromStringParameterAttributes(
      this,
      'AnyuppSecurityGroupName',
      {
        parameterName: anyuppVpcSecurityGroupParamName,
      },
    ).stringValue;

    new CfnOutput(this, 'securityGroupId', {
      value: this.securityGroupId,
      exportName: app.logicalPrefixedName('securityGroupId'),
    });
  }
}
