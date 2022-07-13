import { aws_wafv2 as waf } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface WebAclWithRulesProps {
  namePrefix: string;
  region: string;
  aclType: 'CLOUDFRONT' | 'REGIONAL';
}

export class WebAclWithRules extends Construct {
  readonly webAcl: waf.CfnWebACL;

  constructor(scope: Construct, id: string, props: WebAclWithRulesProps) {
    super(scope, id);

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
      name: `${props.namePrefix}-anyupp-${props.region}-WebAcl`,
      defaultAction: { allow: {} },
      scope: props.aclType,
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `${props.namePrefix}-anyupp-${props.region}-web-acl`,
      },
      rules: [
        managedAWSIpReputationListRuleSet,
        managedAWSCommonRuleSet,
        manageAWSKnownBadInputRuleSet,
        customAnyuppRules,
      ],
    });
  }
}
