import * as sst from '@serverless-stack/resources';
import { Stack, StackProps } from '@serverless-stack/resources';
import { WebAclWithRules } from '../shared/webacl-with-rules';

export class WafStack extends sst.Stack {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(scope: sst.App, id: string, props?: StackProps) {
    super(scope, id);
    props?.env;

    new WebAclWithRules(this, 'frontendAcl', {
      namePostfix: '',
      region: Stack.of(this).region,
      aclType: 'CLOUDFRONT',
    });
  }
}
