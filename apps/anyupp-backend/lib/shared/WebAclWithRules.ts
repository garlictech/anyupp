import { aws_logs, aws_wafv2 as waf, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { App } from '@serverless-stack/resources';

export interface WebAclWithRulesProps {
  namePrefix: string;
  aclType: 'CLOUDFRONT' | 'REGIONAL';
}

export class WebAclWithRules extends Construct {
  readonly webAcl: waf.CfnWebACL;

  constructor(scope: Construct, id: string, props: WebAclWithRulesProps) {
    super(scope, id);
    const app = this.node.root as App;

    const logGroup = new aws_logs.LogGroup(this, 'acl-loggroup', {
      // AWS WAF requires this naming convention: https://docs.aws.amazon.com/waf/latest/developerguide/logging-cw-logs.html
      logGroupName: `aws-waf-logs-${props.namePrefix}-anyupp`,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    const managedAWSIpReputationListRuleSet = {
      priority: 1,
      overrideAction: { none: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-AWS-AWSManagedRulesAmazonIpReputationList`,
      },
      name: `${props.namePrefix}-AWS-AWSManagedRulesAmazonIpReputationList`,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesAmazonIpReputationList',
        },
      },
    };

    const managedAWSCommonRuleSet = {
      priority: 2,
      overrideAction: { none: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-AWS-AWSManagedRulesCommonRuleSet`,
      },
      name: `${props.namePrefix}-AWS-AWSManagedRulesCommonRuleSet`,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesCommonRuleSet',
          excludedRules: [
            {
              name: 'SizeRestrictions_BODY',
            },
          ],
        },
      },
    };

    const customAnyuppRules = {
      priority: 50,
      action: { block: {} },
      name: `${props.namePrefix}-anyUppBodySizeRule`,
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-anyUppBodySizeRule`,
      },
      statement: {
        sizeConstraintStatement: {
          comparisonOperator: 'GE',
          fieldToMatch: { body: {} },
          size: 16384,
          textTransformations: [
            {
              priority: 100,
              type: 'NONE',
            },
          ],
        },
      },
    };

    const manageAWSKnownBadInputRuleSet = {
      priority: 3,
      overrideAction: { none: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-AWS-AWSManagedRulesKnownBadInputsRuleSet`,
      },
      name: `${props.namePrefix}-AWS-AWSManagedRulesKnownBadInputsRuleSet`,
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesKnownBadInputsRuleSet',
        },
      },
    };

    this.webAcl = new waf.CfnWebACL(this, 'frontendAcl', {
      name: `${props.namePrefix}-anyupp-${app.region}-WebAcl`,
      defaultAction: { allow: {} },
      scope: props.aclType,
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-anyupp-${app.region}-web-acl`,
      },
      rules: [
        managedAWSIpReputationListRuleSet,
        managedAWSCommonRuleSet,
        manageAWSKnownBadInputRuleSet,
        customAnyuppRules,
      ],
    });

    new waf.CfnLoggingConfiguration(this, 'logging-config', {
      resourceArn: this.webAcl.attrArn,
      // arn:aws:logs:eu-west-1:568276182587:log-group:aws-waf-logs-anyupp-dev:*
      //`arn:aws:logs:${region}:${accountId}:log-group:aws-waf-logs-for-app`
      logDestinationConfigs: [
        `arn:aws:logs:${app.region}:${app.account}:log-group:${logGroup.logGroupName}`,
      ],
    });
  }
}
