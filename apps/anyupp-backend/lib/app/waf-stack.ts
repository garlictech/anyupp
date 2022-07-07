import { App, StackProps } from '@serverless-stack/resources';
import { aws_wafv2 as waf } from 'aws-cdk-lib';
import { Stack } from '@serverless-stack/resources';
import { WebAclWithRules } from '../shared/WebAclWithRules';
export interface WafStackProps extends StackProps {
  graphqlApiId: string;
}

export class WafStack extends Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: App, id: string, props: WafStackProps) {
    super(scope, id);

    const region = Stack.of(this).region;
    const accountId = Stack.of(this).account;

    const webAcl = new WebAclWithRules(this, 'frontendAcl', {
      namePostfix: '',
      region: region,
      aclType: 'REGIONAL',
    });

    /**
     * For an AWS AppSync GraphQL API: `arn:aws:appsync: *region* : *account-id* :apis/ *GraphQLApiId*`
     */
    new waf.CfnWebACLAssociation(this, 'graphqlapi-webacl-accociation', {
      resourceArn: `arn:aws:appsync:${region}:${accountId}:apis/${props.graphqlApiId}`,
      webAclArn: webAcl.webAcl.attrArn,
    });
  }
}
