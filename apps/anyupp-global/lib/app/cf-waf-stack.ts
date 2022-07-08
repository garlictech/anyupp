import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { App } from '@serverless-stack/resources';
import { Stack, StackProps } from '@serverless-stack/resources';
import { WebAclWithRules } from '../shared/webacl-with-rules';

export class WafStack extends Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id);
    const app = this.node.root as App;

    const webAcl = new WebAclWithRules(this, 'frontendAcl', {
      namePrefix: app.stageName,
      region: Stack.of(this).region,
      aclType: 'CLOUDFRONT',
    });

    new StringParameter(this, 'GlobalWafAclArnParam', {
      stringValue: webAcl.webAcl.attrArn,
      description: 'Global WAF Web ACL Arn deployed in us-east-1',
      parameterName: `${scope.stage}_GLOBAL_WAF_ACL_ARN`,
    });
  }
}
