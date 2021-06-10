import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretsManagerStack } from './secretsmanager-stack';
import * as iam from '@aws-cdk/aws-iam';

export interface CiStackProps extends sst.StackProps {
  readonly secretsManager: SecretsManagerStack;
}

export class CiStack extends sst.Stack {
  public appcenterIamUser: iam.User;

  constructor(app: sst.App, id: string, props: CiStackProps) {
    super(app, id, props);

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: props.secretsManager.githubOauthToken.secretValue,
    });

    // Create an iam user with permission to read ths s3 buckets
    this.appcenterIamUser = new iam.User(this, 'AppcenterIamUser', {
      userName: 'appcenter',
    });
  }
}
