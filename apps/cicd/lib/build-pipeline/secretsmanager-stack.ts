import * as sst from '@serverless-stack/resources';
import * as sm from '@aws-cdk/aws-secretsmanager';

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
        secretArn: props.githubSecretsManagerArn,
      },
    );

    this.projectSecrets = sm.Secret.fromSecretAttributes(
      this,
      'ProjectSecrets',
      {
        secretArn: props.projectSecretsManagerArn,
      },
    );

    this.pipelineSecrets = sm.Secret.fromSecretAttributes(
      this,
      'PipelineSecrets',
      {
        secretArn: props.pipelineSecretsManagerArn,
      },
    );
  }
}
