import { App } from '@serverless-stack/resources';
import { Stack, StackProps } from '@serverless-stack/resources';
import { WebAclWithRules } from '../shared/webacl-with-rules';

export class WafStack extends Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id);
    props?.env;

    new WebAclWithRules(this, 'frontendAcl', {
      namePostfix: '',
      region: Stack.of(this).region,
      aclType: 'CLOUDFRONT',
    });
  }
}
