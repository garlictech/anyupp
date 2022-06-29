import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as sst from '@serverless-stack/resources';
import { Stack, StackProps } from '@serverless-stack/resources';

export class WafStack extends sst.Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: sst.App, id: string, props: StackProps) {
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

    new wafv2.CfnWebACL(this, 'frontendAcl', {
      name: `anyUpp-${Stack.of(this).region}-WebAcl`,
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'web-acl',
      },
      rules: [
        managedAWSIpReputationListRuleSet,
        managedAWSCommonRuleSet,
        manageAWSKnownBadInputRuleSet,
      ],
    });
  }
}
