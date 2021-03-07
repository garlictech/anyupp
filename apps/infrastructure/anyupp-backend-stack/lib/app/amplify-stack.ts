import * as sst from '@serverless-stack/resources';
import * as amplify from '@aws-cdk/aws-amplify';

export type AmplifyStackProps = sst.StackProps;

export class AmplifyStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: AmplifyStackProps) {
    super(app, id, props);

    const adminApp = amplify.App.fromAppId(
      this,
      'AdminAmplifyApp',
      'amplifyadmin',
    );
  }
}
