import { aws_secretsmanager as sm } from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';

export interface SecretsManagerStackProps extends sst.StackProps {
  projectSecretsManagerArn: string;
  pipelineSecretsManagerArn: string;
  githubSecretsManagerArn: string;
}

export class SecretsManagerStack extends sst.Stack {
  public githubOauthToken: sm.ISecret;
  public projectSecrets: sm.ISecret;
  public pipelineSecrets: sm.ISecret;

  constructor(scope: sst.App, id: string, props: SecretsManagerStackProps) {
    super(scope, id, props);

    this.githubOauthToken = sm.Secret.fromSecretAttributes(
      this,
      'GithubOauthTokenSecret',
      {
        secretCompleteArn: props.githubSecretsManagerArn,
      },
    );

    this.projectSecrets = sm.Secret.fromSecretAttributes(
      this,
      'ProjectSecrets',
      {
        secretCompleteArn: props.projectSecretsManagerArn,
      },
    );

    this.pipelineSecrets = sm.Secret.fromSecretAttributes(
      this,
      'PipelineSecrets',
      {
        secretCompleteArn: props.pipelineSecretsManagerArn,
      },
    );
  }
}
