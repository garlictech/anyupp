import { App, Stack } from '@serverless-stack/resources';
import { aws_securityhub, aws_accessanalyzer } from 'aws-cdk-lib';

/**
 * Core services. They need to created once per an account
 */
export class AnyuppAccountServicesStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const app = this.node.root as App;

    new aws_securityhub.CfnHub(this, 'SecurityHub', {});

    new aws_accessanalyzer.CfnAnalyzer(this, 'Default Analyzer', {
      analyzerName: `${app.stage}-anyupp-iam-access-analyzer`,
      type: 'ACCOUNT',
    });
  }
}
