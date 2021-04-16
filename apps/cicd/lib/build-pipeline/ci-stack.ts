import * as sst from '@serverless-stack/resources';
import * as codebuild from '@aws-cdk/aws-codebuild';
import { SecretsManagerStack } from './secretsmanager-stack';

export interface CiStackProps extends sst.StackProps {
  readonly secretsManager: SecretsManagerStack;
}

export class CiStack extends sst.Stack {
  constructor(app: sst.App, id: string, props: CiStackProps) {
    super(app, id, props);

    new codebuild.GitHubSourceCredentials(this, 'CodeBuildGitHubCreds', {
      accessToken: props.secretsManager.githubOauthToken.secretValue,
    });
  }
}
