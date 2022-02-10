import { aws_iam as iam, aws_codebuild as codebuild } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import { SecretsManagerStack } from './secretsmanager-stack';

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
