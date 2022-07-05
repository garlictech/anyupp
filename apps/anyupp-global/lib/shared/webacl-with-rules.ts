import { aws_wafv2 as waf } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface WebAclWithRulesProps {
  namePostfix: string;
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
        metricName: 'AWS-AWSManagedRulesAmazonIpReputationList',
      },
      name: 'AWS-AWSManagedRulesAmazonIpReputationList',
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
        metricName: 'AWS-AWSManagedRulesCommonRuleSet',
      },
      name: 'AWS-AWSManagedRulesCommonRuleSet',
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesCommonRuleSet',
        },
      },
    };

    const manageAWSKnownBadInputRuleSet = {
      priority: 3,
      overrideAction: { none: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
      },
      name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
      statement: {
        managedRuleGroupStatement: {
          vendorName: 'AWS',
          name: 'AWSManagedRulesKnownBadInputsRuleSet',
        },
      },
    };

    this.webAcl = new waf.CfnWebACL(this, 'frontendAcl', {
      name: `anyupp-${props.region}-WebAcl-${props.namePostfix}`,
      defaultAction: { allow: {} },
      scope: props.aclType,
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `anyupp-${props.region}-web-acl-${props.namePostfix}`,
      },
      rules: [
        managedAWSIpReputationListRuleSet,
        managedAWSCommonRuleSet,
        manageAWSKnownBadInputRuleSet,
      ],
    });
  }
}
