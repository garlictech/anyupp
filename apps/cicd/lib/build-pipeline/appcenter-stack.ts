import * as sst from '@serverless-stack/resources';
import * as iam from '@aws-cdk/aws-iam';

export type AppcenterStackProps = sst.StackProps;

export class AppcenterStack extends sst.Stack {
  public iamUser: iam.User;
  constructor(app: sst.App, id: string, props?: AppcenterStackProps) {
    super(app, id, props);

    // Create an iam user with permission to read ths s3 buckets
    this.iamUser = new iam.User(this, 'AppcenterIamUser', {
      userName: 'appcenter',
    });
  }
}
