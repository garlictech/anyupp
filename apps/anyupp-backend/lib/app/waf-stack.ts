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

    const app = this.node.root as App;

    const webAcl = new WebAclWithRules(this, 'frontendAcl', {
      namePrefix: app.stage,
      aclType: 'REGIONAL',
    });

    /**
     * For an AWS AppSync GraphQL API: `arn:aws:appsync: *region* : *account-id* :apis/ *GraphQLApiId*`
     */
    new waf.CfnWebACLAssociation(this, 'graphqlapi-webacl-accociation', {
      resourceArn: `arn:aws:appsync:${app.region}:${app.account}:apis/${props.graphqlApiId}`,
      webAclArn: webAcl.webAcl.attrArn,
    });
  }
}
