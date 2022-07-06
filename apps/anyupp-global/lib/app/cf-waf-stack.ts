import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { App } from '@serverless-stack/resources';
import { Stack, StackProps } from '@serverless-stack/resources';
import { WebAclWithRules } from '../shared/webacl-with-rules';

export const GLOBAL_WAF_ACL_ARN_PARAM_NAME = 'GLOBAL_WAF_ACL_ARN';
export class WafStack extends Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id);
    props?.env;

    const webAcl = new WebAclWithRules(this, 'frontendAcl', {
      namePostfix: '',
      region: Stack.of(this).region,
      aclType: 'CLOUDFRONT',
    });

    new StringParameter(this, 'GlobalWafAclArnParam', {
      stringValue: webAcl.webAcl.attrArn,
      description: 'Global WAF Web ACL Arn deployed in us-east-1',
      parameterName: GLOBAL_WAF_ACL_ARN_PARAM_NAME,
    });
  }
}
